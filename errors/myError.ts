// Custom base error class extending the built-in Error class
export class MyError extends Error {
    public status?: number; // Optional status property to hold HTTP status codes

    // Constructor to initialise the error with a custom message
    constructor(msg: string) {
        super(msg); // Call the built-in Error constructor with the message
    }
}
