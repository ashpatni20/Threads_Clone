const userRoutes = require("express").Router();
const upload = require("../middlewares/uploadFile.js");
const {
  signup,
  login,
  logout,
  updateUser,
  getProfile,
  followUser,
  unFollowUser
} = require("../controllers/userController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/update", upload.single('avatar'), authMiddleware, updateUser);
userRoutes.get("/logout", authMiddleware, logout);
userRoutes.get("/getProfile", authMiddleware, getProfile);

userRoutes.get("/follow", authMiddleware, followUser);
userRoutes.get("/unFollow", authMiddleware, unFollowUser);



module.exports = userRoutes;

// signup
// {
//   "userName": "John Doe",
//   "email": "john.doe@example.com",
//   "password": "12345678"
// }

// {
//   "userName": "Jane Smith",
//   "email": "jane.smith@example.com",
//   "password": "password123"
// },
// {
//   "userName": "Alice Johnson",
//   "email": "alice.johnson@example.com",
//   "password": "qwerty123"
// }

// Curr
// {
//   "userName": "Bob Brown",
//   "email": "bob.brown@example.com",
//   "password": "letmein2024"
// }
