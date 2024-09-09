import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; // Import status codes for HTTP responses
import { MyError } from "../errors"; // Import custom error class

import { MulterError } from "multer"; // Import error type for file upload handling
import { Prisma } from "@prisma/client"; // Import Prisma error types

// Async function to handle various errors that can occur in the application
export async function errorHandler(
  err: MyError | MulterError | Prisma.PrismaClientKnownRequestError, // Accepts multiple error types
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check if the error is an instance of the custom MyError class
  if (err instanceof MyError) {
    return res.status(err.status as number).send({
      err: {
        message: err.message, // Send the error message defined in MyError
      },
    });
  }

  // Log the error to the console for debugging purposes
  console.log(err);

  // Check if the error is related to Multer (file upload)
  if (err instanceof MulterError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      err: {
        message: "There was an error in uploading image", // Specific error message for file upload issues
      },
    });
  }

  // Check if the error is a Prisma error (database-related)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Specific handling for Prisma error code P2025 (usually when a record is not found)
    if (err.code === "P2025") {
      return res.status(StatusCodes.NOT_FOUND).send({
        err: {
          message: err.message, // Send Prisma's error message
        },
      });
    }
  }

  // Log any unhandled errors to the console
  console.log(err);

  // If the error doesn't match any known types, send a generic internal server error response
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    err: {
      message: "Internal server error", // Generic error message for unexpected issues
    },
  });
}
