import { StatusCodes } from "http-status-codes"; // Import status code constants
import { MyError } from "./myError"; // Import custom base error class

// Custom error class for handling "Unauthorized" errors (401 status code)
export class UnAuthenticatedError extends MyError {
  public status: number; // Public property to hold HTTP status code

  // Constructor to initialise the error with a custom message
  constructor(message: string) {
    super(message); // ccall parent class (MyError) constructor with the message
    this.status = StatusCodes.UNAUTHORIZED; // Set HTTP status code to 401 (Unauthorized)
  }
}
