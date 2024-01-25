// config/cloudinary.config.js

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dagd6tl2v",
  api_key: process.env.CLOUDINARY_KEY || "854913546716111",
  api_secret: process.env.CLOUDINARY_SECRET || "Jx9TuZw-XSz3vtD46fraS4RgVYU",
});

const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png", "jpeg"],
    folder: "profile-images-dplan", // The name of the folder in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  },
});

//                     storage: storage
module.exports = multer({ storage });
