import { Router } from "express";
import { createDevice, deleteDevice, getDevice, getDevices, updateDevice } from "../controllers/devices";

export const router = Router();

router.route("/").get(getDevices).post(createDevice);
router.route("/:id").get(getDevice).put(updateDevice).delete(deleteDevice);