import { Router } from "express";
import { startFootage, delFootage, getFootage } from "../controllers/footage";
import { upload } from "../middleware/videoUpload";
import { validateDuration } from "../middleware/validateDuration";
import { convertWebMToMP4Middleware } from "../middleware/convertToMp4";

export const router = Router();

router.route("/").get(getFootage).post(upload.single("video"), convertWebMToMP4Middleware,  validateDuration(20), startFootage);

router.route("/:id").delete(delFootage);