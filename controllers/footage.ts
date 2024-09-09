import { Request, Response } from "express";
import { prisma } from "../database";
import { StatusCodes } from "http-status-codes";
import { unlink } from "fs/promises"; // Used to delete files asynchronously
import { triggerEmail } from "../utils/email"; // Utility function to send emails
import { SENDER_EMAIL, TRANSPORTER } from "../constant"; // Constants for email configurations
import express from "express";
import path from "path";

const app = express();

// Serve static video files from the "videos" folder
app.use("/videos", express.static(path.join(__dirname, "videos")));

// Function to handle video footage detection and storage
export const startFootage = async (req: Request, res: Response) => {
  try {
    // Create a new detection record in the database, associating it with the uploaded video file (if any)
    const detection = await prisma.detection.create({
      data: {
        ...req.body, // All data from request body
        video: req.file?.path, // File path to uploaded video
        deviceId: Number(req.body.deviceId), // Convert device ID from string to number
      },
    });

    // Format current date and time to display in email
    const currentTime = new Date().toLocaleString("en-US", {
      month: "long", // Full month name
      day: "numeric", // Numeric day of the month
      year: "numeric", // Full year
      hour: "numeric",
      minute: "numeric",
      hour12: true, // 12-hour format (AM/PM)
    });

    // subject and body of the email alert
    const emailSubject = `Alert: ${detection.description} detected!`;
    const emailBody = `Alert: ${detection.description} detected!\nTime triggered: ${currentTime}`;

    // Send an alert email to the user
    await triggerEmail(
      TRANSPORTER, // Email transport configuration
      SENDER_EMAIL, // The sender's email
      res.locals.user.email, // Recipient's email (from user session)
      emailSubject, // Email subject
      emailBody // Email body
    );

    // Send created detection data as the response
    res.status(StatusCodes.CREATED).send({
      detection,
    });
  } catch (err) {
    // If there is an error and a video file was uploaded, delete it to clean up
    if (req.file?.path) {
      await unlink(req.file?.path); // Asynchronously delete the video file
    }
    // Propagate error
    throw err;
  }
};

// Function to retrieve all footage detections for a user
export const getFootage = async (req: Request, res: Response) => {
  // Query database for all detection records associated with the user
  const detections = await prisma.detection.findMany({
    where: {
      device: {
        userId: res.locals.user.id, // Filter by the current user's ID
      },
    },
    include: {
      device: {
        select: {
          name: true, // Include device name in the result
        },
      },
    },
  });

  // Map detections to include full URLs for the video files
  const footages = detections.map((detection) => ({
    ...detection, // All detection data
    videoUrl: detection.video
      ? `/videos/${path.basename(detection.video)}` // Generate video URL path
      : null, // If no video, set videoUrl to null
  }));

  // Respond with the list of detections and their video URLs
  res.status(StatusCodes.OK).send({
    detections: footages,
  });
};

// Function to delete a specific video footage record
export const delFootage = async (req: Request, res: Response) => {
  try {
    // Find the detection/footage by its ID in the database
    const footage = await prisma.detection.findUnique({
      where: {
        id: Number(req.params.id), // Convert ID from string to number
      },
    });

    // If the footage is not found, respond with a 404 status
    if (!footage) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Footage not found",
      });
    }

    // If footage has video file, delete the video from the filesystem
    if (footage.video) {
      const videoPath = path.join(__dirname, "..", footage.video); // Construct the file path
      await unlink(videoPath); // Asynchronously delete the video file
    }

    // Delete detection record from database
    await prisma.detection.delete({
      where: {
        id: Number(req.params.id), // Delete by ID
      },
    });

    // Send a 204 No Content response, indicating successful deletion with no response body
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    // Log error to the server console
    console.error("Error deleting footage:", err);
    // Send a 500 status indicating a server error
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error deleting footage",
    });
  }
};
