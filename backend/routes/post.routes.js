const postRoutes = require("express").Router();
const {
  createpost,
  getAllPost,
  removePost,
  likePost,
  dislikePost,
  commentPost,
} = require("../controllers/postController.js");
const upload = require("../middlewares/uploadFile.js");


postRoutes.post(
  "/createPost",
  upload.single("avatar"),
  createpost
);
postRoutes.get("/allPosts", getAllPost);
postRoutes.post("/removePost", removePost);
postRoutes.post("/likePost", likePost);
postRoutes.post("/unlikePost", dislikePost);
postRoutes.post("/commentPost", commentPost);

module.exports = postRoutes;

// Create post
// {
//     "title": "Second Post",
//     "description": "This is the description for the second post.",
//     "image": "https://example.com/image2.jpg",
//     "user": "60d0fe4f5311236168a109cb"
//   }

//   {
//     "title": "Third Post",
//     "description": "This is the description for the third post.",
//     "image": "https://example.com/image3.jpg",
//     "user": "60d0fe4f5311236168a109cc"
//   }
