import { StatusCodes } from "http-status-codes"; // Import status code constants
import { MyError } from "./myError"; // Import custom base error class

// Custom error class for handling "Bad Request" errors (400 status code)
export class BadRequestError extends MyError {
  public status: number; // Define a public property to hold HTTP status code

  // Constructor to initialise error with a custom message
  constructor(message: string) {
    super(message); // Call the parent class (MyError) constructor with the message
    this.status = StatusCodes.BAD_REQUEST; // Set HTTP status code to 400 (Bad Request)
  }
}
