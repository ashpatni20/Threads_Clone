const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentedBy: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const postModel = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    cloudId: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [commentSchema],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("Post", postModel);

