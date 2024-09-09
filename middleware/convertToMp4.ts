import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { unlink } from "fs/promises";
import { NextFunction, Request, Response } from "express";

// Function to convert a WebM file to MP4
const convertWebMToMP4 = async (inputPath: string): Promise<string> => {
    // Construct output path for the MP4 file
    const outputPath = path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}.mp4`);

    // Use ffmpeg to actually convert the WebM file to MP4 format
    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .on('end', resolve) // When done converting, resolve promise
            .on('error', reject) // If something goes wrong, reject promise
            .run(); // Start conversion process
    });

    // Delete original WebM file since we don't need it anymore
    await unlink(inputPath); 
    return outputPath; // Return the new MP4 file path
};

// Middleware to handle WebM to MP4 conversion if uploaded file is a WebM video
export const convertWebMToMP4Middleware = async (req: Request, res: Response, next: NextFunction) => {
    // Check if there's a file in the request and if it's a WebM video
    if (req.file) {
        if (req.file.mimetype === "video/webm") {
            // Convert WebM file to MP4 and updatee file info in the request
            req.file.path = await convertWebMToMP4(req.file.path);
            req.file.mimetype = "video/mp4"; // Change mimetype since it's now an MP4
        }
    }

    // Call next middleware or route handler
    next();
}
