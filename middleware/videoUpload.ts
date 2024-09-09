import multer, { FileFilterCallback } from "multer"; // Import multer for file handling and file filter callback type
import { Request } from "express";
import path from "path"; // Import path to handle file paths and extensions
import { createUniqueId } from "../utils/idCreater"; // Import function to create unique IDs for file names
import { BadRequestError } from "../errors"; // Import custom error for handling bad requests
import { VIDEO_SIZE_LIMIT } from "../constant"; // Import a constant for the file size limit

// Set up storage destination and file naming convention for uploaded videos
const storage = multer.diskStorage({
  // Set the destination folder where the videos will be stored
  destination: "./videos",

  // Define how file names are generated
  filename: function (req, file, cb) {
    const uniqueSuffix = createUniqueId(); // Generate unique ID for each file
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append original file extension
  },
});

// Filter function to ensure only video files are uploaded
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Define allowed file types using regular expressions for video formats
  const allowedFileTypes = /mp4|avi|webm|mkv|mov/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
  const mimetype = allowedFileTypes.test(file.mimetype); // Check MIME type

  // If both the file extension and MIME type are valid, accept file
  if (mimetype && extname) {
    return cb(null, true);
  }

  // If the file type is invalid, throw bad request error
  throw new BadRequestError(`${file.mimetype} file type is not supported`);
};

// Set up the multer upload configuration with storage, file filter, and size limits
export const upload = multer({
  storage, // Use custom storage setup for naming and storing files
  fileFilter, // Use custom file filter to allow only specific video formats
  limits: { fileSize: VIDEO_SIZE_LIMIT } // Limit file size to the value set in the constant (e.g., 10MB)
});
