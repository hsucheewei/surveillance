import { StatusCodes } from "http-status-codes"; // Import status code constants
import { MyError } from "./myError"; // Import custom base error class

// Custom error class for handling "Not Found" errors (404 status code)
export class NotFoundError extends MyError {
  public status: number; // Define a public property to hold HTTP status code

  // Constructor to initialise the error with a custom message
  constructor(message: string) {
    super(message); // Call parent class (MyError) constructor with the message
    this.status = StatusCodes.NOT_FOUND; // Set HTTP status code to 404 (Not Found)
  }
}
