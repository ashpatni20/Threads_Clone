const userModule = require("../model/user.model");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const uploadOnCloudinary = require("../middlewares/cloudinary");
const cloudinary = require("cloudinary").v2;

const signup = async (req, res) => {
  console.log(req.body);
  const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json(new ApiError(401, "Invalid email address"));
  }

  try {
    const existingUser = await userModule.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json(new ApiError(401, "User already exists"));
    }

    const newUser = req.body;
    // console.log(...newUser)

    const createdUser = await userModule.create(newUser);

    return res.json({
      success: true,
      message: "User Created",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        new ApiError(500, err.message || "Something went wrong", [
          "Something went wrong",
        ])
      );
  }
};

const login = async (req, res) => {
  try {
    const user = await userModule.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const { password } = req.body;
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json(new ApiError(401, "Wrong Password"));
    }

    const jwtPayload = {
      userId: user._id,
      userName: user.userName,
      avatar: user.avatar,
    };

    const token = jwt.sign(jwtPayload, process.env.SECRET_TOKEN_KEY, {
      expiresIn: "1d",
    });
    await userModule.findByIdAndUpdate(user._id, { $set: { token: token } });

    return res
      .status(200)
      .cookie("Authorization", `Bearer ${token}`, {
        httpOnly: true,
        // secure: true, // only send cookie over https
        sameSite: 'None',
      })
      .json({
        success: true,
        message: "Login successfully",
        token: `Bearer ${token}`,
        userId: user._id,
        avatar: user.avatar,
      });
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(501, err.message || "User Login failed", [
          ["Please Login again"],
        ])
      );
  }
};

const logout = async (req, res) => {
  try {
    const logOutUser = await userModule.findByIdAndUpdate(req.user.userId, {
      $set: { token: null },
    });

    return res.status(200).json({
      success: true,
      message: `User Logout successfully`,
    });
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(500, err.message || "User Logout failed", [
          ["Please try again cancelling your request"],
        ])
      );
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userModule.findById(req.user.userId);

    const { bio, website, location } = req.body;
    const updateData = { bio, website, location };

    if (!user) {
      return res.status(404).json(
        new ApiError(500, "User not found", [
          ["Error updating user"],
        ])
      );
    }


    // let updateData = { ...req.body };

    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      if (uploadResponse) {
        updateData.avatar = uploadResponse.secure_url;
      } else {
        return res.status(500).json({
          success: false,
          message: "Error uploading file to Cloud",
        });
      }
    }

    await userModule.findByIdAndUpdate(
      req.user.userId,
      {
        $set: updateData,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message || "Something went wrong", [
        ["Error updating user"],
      ])
    );
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModule
      .findById(req.query?.id)
      .populate({
        path: "posts",
        select: "-comments",
      })
      .select("-password -token -mobile");

    if (!user) {
      return res
        .status(404)
        .json(new ApiError(404, "Something went wrong", ["User not found"]));
    }

    res.json({
      success: true,
      message: "Current user posts",
      data: {
        user,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json(
        new ApiError(500, err.message || "Something went wrong", [
          "Error getting posts",
        ])
      );
  }
};


const followUser = async (req, res) => {
  try {
    const visitedUser = req?.query?.id || req?.body?.id;
    const currUser = req.user.userId;

    if (visitedUser === currUser) {
      return res.status(400).json(
        new ApiError(400, "You cannot follow yourself", ["Error following user"]),
      );
    }

    const loggedInUser = await userModule.findOne({ _id: currUser });

    if (loggedInUser.following.includes(visitedUser)) {
      return res.status(400).json(
        new ApiError(400, "You are already following this user", ["Error following user"]),
      );
    }

    const updatedUser = await userModule.findOneAndUpdate(
      { _id: currUser },
      { $push: { following: visitedUser } },
      { new: true }
    );

    await userModule.findOneAndUpdate(
      { _id: visitedUser },
      { $push: { followers: currUser } },
      { new: true }
    );

    res.json({ success: true, message: "User followed successfully" });

  } catch (error) {
    res.status(500).json(
      new ApiError(500, error.message || "Internal server error", ["Error following user"]),
    );
  }
};

const unFollowUser = async (req, res) => {
  try {
    const visitedUser = req?.query?.id || req?.body?.id;
    const currUser = req.user.userId;

    if (visitedUser === currUser) {
      return res.status(400).json(
        new ApiError(400, "You can't unFollow yourself", ["Error unFollow user"]),
      );
    }

    const loggedInUser = await userModule.findOne({ _id: currUser });

    if (loggedInUser.followers.includes(visitedUser)) {
      return res.status(400).json(
        new ApiError(400, "You are not following this user", ["Error unFollow user"]),
      );
    }

    const updatedUser = await userModule.findOneAndUpdate(
      { _id: currUser },
      { $pull: { followers: visitedUser } },
      { new: true }
    );

    await userModule.findOneAndUpdate(
      { _id: visitedUser },
      { $pull: { following: currUser } },
      { new: true }
    );

    res.json({ success: true, message: "User unFollow successfully" });

  } catch (error) {
    res.status(500).json(
      new ApiError(500, error.message || "Internal server error", ["Error following user"]),
    );
  }
};



// const followUserOptimised = async (req, res) => {
//   // Start a DB Transaction
//   const session = await userModule.startSession();
//   session.startTransaction();

//   try {
//     const visitedUser = req?.query?.id;
//     const currUser = req.user.userId;

//     if (visitedUser === currUser) {
//       await session.abortTransaction(); 
//       session.endSession(); 
//       return res
//         .status(400)
//         .json(
//           new ApiError(400, "You cannot follow yourself", [
//             "Error following user",
//           ])
//         );
//     }

//     // Fetch both the current user and the visited user within the session
//     const [loggedInUser, targetUser] = await Promise.all([
//       userModule.findById(currUser).session(session),
//       userModule.findById(visitedUser).session(session),
//     ]);

//     if (!loggedInUser || !targetUser) {
//       await session.abortTransaction(); // Abort the transaction
//       session.endSession(); // End the session
//       return res
//         .status(404)
//         .json(new ApiError(404, "User not found", ["Error following user"]));
//     }

//     if (loggedInUser.following.includes(visitedUser)) {
//       await session.abortTransaction(); // Abort the transaction
//       session.endSession(); // End the session
//       return res
//         .status(400)
//         .json(
//           new ApiError(400, "You are already following this user", [
//             "Error following user",
//           ])
//         );
//     }

//     // Update the following and followers lists within the session
//     loggedInUser.following.push(visitedUser);
//     targetUser.followers.push(currUser);

//     // Save the documents within the transaction session
//     await Promise.all([
//       loggedInUser.save({ session }),
//       targetUser.save({ session }),
//     ]);

//     await session.commitTransaction(); // Commit the transaction
//     session.endSession(); // End the session

//     res.json({ success: true, message: "User followed successfully" });
//   } catch (error) {
//     await session.abortTransaction(); // Abort the transaction in case of error
//     session.endSession(); // End the session
//     res
//       .status(500)
//       .json(
//         new ApiError(500, error.message || "Internal server error", [
//           "Error following user",
//         ])
//       );
//   }
// };

const userController = {
  signup,
  login,
  logout,
  updateUser,
  getProfile,
  followUser,
  unFollowUser
};

module.exports = userController;
