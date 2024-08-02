const uploadOnCloudinary = require("../middlewares/cloudinary");
const postModel = require("../model/post.model");
const userModule = require("../model/user.model");
const ApiError = require("../utils/ApiError");
const cloudinary = require("cloudinary").v2;

const createpost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = { title, description, user: req.user.userId };

    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (uploadResponse) {
        post.image = uploadResponse.secure_url;
        post.cloudId = uploadResponse.public_id;
      } else {
        return res.status(500).json({
          success: false,
          message: "Error uploading file to Cloud",
        });
      }
    }

    const createUserPost = await postModel.create(post);

    const addUserToPost = await userModule.findByIdAndUpdate(req.user.userId, {
      $push: {
        posts: createUserPost._id,
      },
    });

    res.json({
      success: true,
      message: "Post added successfully",
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};


const getAllPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("user", "avatar userName");

    res.json({
      success: true,
      message: "All posts",
      posts: posts,
      page: page,
      limit: limit,
    });
  } catch (err) {
    res
      .status(500)
      .json(
        new ApiError(500, err.message || "Something went wrong", [
          "Error getting posts",
        ])
      );
  }
};

const removePost = async (req, res) => {
  try {
    const userPost = await userModule.findByIdAndUpdate(req.user.userId, {
      $pull: {
        posts: req.body.postId,
      },
    });

    if (!userPost) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Something went wrong", ["Error deleting post"])
        );
    }

    const post = await postModel.findByIdAndDelete(req.body.postId);

    if (!post) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Something went wrong", ["Error deleting post"])
        );
    }

    const cloudDel = post.cloudId;

    cloudinary.v2.api
      .delete_resources([cloudDel], { type: "upload", resource_type: "image" })
      .then(console.log);

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(500, error.message || "Something went wrong", [
          "Error deleting post",
        ])
      );
  }
};


const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.userId;
        // $addToSet: { likes: userId }, // Add userId to likes if it's not already there

    const updatedPost = await postModel.findOneAndUpdate(
      //  $ne not equall
      { _id: postId, likes: { $ne: userId } }, 
      {
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 }, 
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json(
        new ApiError(404, "You have already liked this post")
      );
    }

    res.json({ success: true, message: "Post liked successfully", post: updatedPost });
  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, ["Something went wrong"])
    );
  }
};
const dislikePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.body.postId;

    const updatedPost = await postModel.findOneAndUpdate(
      { _id: postId, likes: userId },
      {
        $pull: { likes: userId },
        $inc: { likeCount: -1 },
      },
      { new: true } 
    );

    if (!updatedPost) {
      return res.status(400).json(
        new ApiError(400, "You have not liked this post yet")
      );
    }

    res.json({ success: true, message: "Post disliked successfully", post: updatedPost });
  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, ["Something went wrong"])
    );
  }
};


const commentPost = async (req, res) => {
  try {
    const validPost = await postModel.findById(req.body.postId);
    if (!validPost) {
      return res.status(404).json(
        new ApiError(404, "Something went wrong", ["Post not found"])
      );
    }

    // console.log(req.user)

    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json(
        new ApiError(400, "Comment text is required", ["Comment required cant be empty"])
      );
    }

    const comment = {
      text,
      user: req.user.userId,
      commentedBy: req.user.userName,
    };

    validPost.comments.push(comment);
    await validPost.save();
    
    res.json({ success: true, message: "Comment added successfully" });
  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, ["Something went wrong"])
    );
  }
};

module.exports = { likePost, dislikePost, commentPost };


const postController = {
  createpost,
  removePost,
  getAllPost,
  likePost,
  dislikePost,
  commentPost,
};
module.exports = postController;
