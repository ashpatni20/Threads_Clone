// const cloudinary = require('cloudinary').v2;
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const formattedFilePath = path.resolve(localFilePath).replace(/\\/g, "/");

    if (!fs.existsSync(formattedFilePath)) {
      console.error("File does not exist:", formattedFilePath);
      return null;
    }

    const response = await cloudinary.uploader.upload(formattedFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(formattedFilePath);

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

module.exports = uploadOnCloudinary;
