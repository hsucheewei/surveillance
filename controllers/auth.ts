import { Request, Response } from "express";
import { prisma } from "../database";
import { BadRequestError, NotFoundError, UnAuthenticatedError } from "../errors";
import { StatusCodes } from "http-status-codes";

// Handler for user login
export const login = async (req: Request, res: Response) => {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Check if email or password is missing from request
    if (!email || !password) {
        // Throw an error if either field is missing
        throw new BadRequestError("Email and password required");
    }

    // Find the user in the database using the email
    const user = await prisma.user.findFirstOrThrow({
        where: {
            email,
        },
    });

    // Verify if the provided password matches the user's password
    const isPasswordCorrect = await prisma.user.comparePassword(password, user.password);

    // If password is incorrect, throw unauthorised error
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError("Invalid credentials");
    }

    // Generate a JWT (token) for authenticated user
    const token = await prisma.user.createJWT(user.id, user.email);

    // Exclude password field from user object before sending response
    const { password: _, ...jsonUser } = user;

    // Send back user information and JWT token in response
    res.status(StatusCodes.OK).send({
        user: jsonUser,
        token,
    });
};

// Handler for user signup
export const signUp = async (req: Request, res: Response) => {
    // Create a new user in the database using provided data from the request body
    const user = await prisma.user.create({
        data: req.body,
    });

    // Exclude password field from response
    const { password, ...userJson } = user;

    // Send back newly created user information in response
    res.status(StatusCodes.CREATED).send({
        user: userJson,
    });
};
