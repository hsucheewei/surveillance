import { NextFunction, Request, Response } from "express"; // Import necessary types from express
import { JsonWebTokenError, JwtPayload, verify } from "jsonwebtoken"; // Import JWT functions and types
import { UnAuthenticatedError } from "../errors"; // Import custom error for handling unauthorised access
import { JWT_SECRET } from "../constant"; // Import the secret key used to sign and verify JWTs

// Middleware to authenticate requests using JWT
export async function auth(req: Request, res: Response, next: NextFunction) {
  // Get Authorization header from the request
  const authHeaders = req.headers.authorization;

  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new UnAuthenticatedError("Invalid token"); // Throw an error if the token is missing or malformed
  }

  // Extract token part from 'Bearer ' string
  const [, token] = authHeaders.split(" ");

  try {
    // Verify token using the JWT secret and cast as a JwtPayload
    const decoded = verify(token, JWT_SECRET) as JwtPayload;

    // Store decoded user data in res.locals for use in other routes/middleware
    res.locals.user = decoded;

    // Proceed to next middleware or route handler
    next();
  } catch (e: unknown) {
    // Catch errors related to JWT validation
    if (e instanceof JsonWebTokenError) {
      // If error is JWT-specific, throw an unauthorized error
      throw new UnAuthenticatedError("Invalid token");
    } else {
      // If error is not related to JWT, throw original error
      throw e;
    }
  }
}
