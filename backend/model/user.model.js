const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModule = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      required: true,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
    },
    birthdate: {
      type: Date,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
  }
);



userModule.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userModule.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userModule.methods.generateToken = async function () {
  const token = await jwt.sign(
    { id: this._id, email: this.email },
    process.env.SECRET_TOKEN_KEY,
    { expiresIn: "1d" }
  );
  return token;
};

module.exports = mongoose.model("User", userModule);
