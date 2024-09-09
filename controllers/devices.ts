import { Request, Response } from "express";
import { prisma } from "../database";
import { StatusCodes } from "http-status-codes";
import { UnAuthorizedError } from "../errors";

// Handler to get a single device by its ID
export const getDevice = async (req: Request, res: Response) => {
    // Retrieve the device using ID from request parameters and throw error if not found
    const device = await prisma.device.findFirstOrThrow({
        where: {
            id: Number(req.params.id),  // Convert id parameter from string to number
        },
    });

    // Send found device object in the response with a status of 200 (OK)
    res.status(StatusCodes.OK).send({
        device,
    });
};

// Handler to get multiple devices belonging to a user
export const getDevices = async (req: Request, res: Response) => {
    // Check if the requesting user's ID matches the userId in the query parameters
    if (res.locals.user.id !== Number(req.query.userId)) {
        // If IDs don't match, throw unauthorised error
        throw new UnAuthorizedError("Unauthorised");
    }

    // Fetch all devices belonging to specified userId
    const devices = await prisma.device.findMany({
        where: {
            userId: Number(req.query.userId),  // Convert userId from query string to number
        },
    });

    // Send the list of devices in response with a status of 200 (OK)
    res.status(StatusCodes.OK).send({
        devices,
    });
};

// Handler to create a new device entry in the database
export const createDevice = async (req: Request, res: Response) => {
    // Create a new device in the database using the request body data
    const device = await prisma.device.create({
        data: req.body,  // The request body contains device data to be stored
    });

    // Send the newly created device object in the response with a status of 201 (Created)
    res.status(StatusCodes.CREATED).send({
        device,
    });
};

// Handler to delete a device and its associated detections
export const deleteDevice = async (req: Request, res: Response) => {
    // Use a transaction to delete all associated detections and the device itself
    await prisma.$transaction([
        prisma.detection.deleteMany({
            where: {
                deviceId: Number(req.params.id),  // Convert device ID from string to number
            },
        }),
        prisma.device.delete({
            where: {
                id: Number(req.params.id),  // Delete device by its ID
            },
        }),
    ]);

    // Send a 204 No Content response to indicate successful deletion with no content in the body
    res.status(StatusCodes.NO_CONTENT).send();
};

// Handler to update an existing device's information
export const updateDevice = async (req: Request, res: Response) => {
    // Update device with provided data from the request body, based on its ID
    const device = await prisma.device.update({
        where: {
            id: Number(req.params.id),  // Convert device ID from string to number
        },
        data: req.body,  // Update device fields with new data from the request
    });

    // Send updated device object in the response with a status of 200 (OK)
    res.status(StatusCodes.OK).send({
        device,
    });
};
