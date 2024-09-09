import getVideoDurationInSeconds from "get-video-duration"; // Import a function to get the duration of a video
import { NextFunction, Request, Response } from "express";
import { unlink } from "fs/promises"; // Import unlink to delete files
import { BadRequestError } from "../errors"; // Import custom error for handling bad requests

// Middleware function to validate video duration
export const validateDuration =
  (duration: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if there's a file uploaded
    if (req.file) {
      // Get duration of uploaded video
      const videoDuration = await getVideoDurationInSeconds(req.file.path);

      // Check if video duration is longer than the allowed limit
      if (videoDuration > duration) {
        // If too long, delete uploaded file
        await unlink(req.file.path);
        // Throw error with message specifying the max allowed duration
        throw new BadRequestError(
          `Video length must be less than ${duration} seconds`
        );
      }
    } else {
      // If no file is uploaded, throw  error
      throw new BadRequestError("Failed to upload video");
    }

    next();
  };
