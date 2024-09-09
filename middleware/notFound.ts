import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; // Import status code constants for HTTP responses

// Middleware to handle requests for routes that do not exist
export async function notFound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Set response status to 404 (Not Found) and send a JSON response with an error message
  res.status(StatusCodes.NOT_FOUND).send({
    msg: "Resource not found", // message to indicate requested resource was not found
  });
}
