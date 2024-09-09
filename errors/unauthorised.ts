import { StatusCodes } from "http-status-codes"; // Import status code constants
import { MyError } from "./myError"; // Import custom base error class

// Custom error class for handling "Forbidden" errors (403 status code)
export class UnAuthorizedError extends MyError {
  public status: number; // Public property to hold the HTTP status code

  // Constructor to initialise the error with a custom message
  constructor(message: string) {
    super(message); // Call the parent class (MyError) constructor with the message
    this.status = StatusCodes.FORBIDDEN; // Set the HTTP status code to 403 (Forbidden)
  }
}
