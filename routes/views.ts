import { Request, Response, Router } from "express";
import path from "path";

export const router = Router();

function serveHtml(file: string) {
    return (req: Request, res: Response) => {
        res.status(200).sendFile(path.join(process.cwd(), "/public", file));
    }
}

router.get("/", serveHtml("index.html"));
router.get("/login", serveHtml("login.html"));
router.get("/signup", serveHtml("signup.html"));
router.get("/footage", serveHtml("footage.html"));
router.get("/devices", serveHtml("devices.html"));
router.get("/settings", serveHtml("settings.html"));
router.get("/alerts", serveHtml("alerts.html"));
router.get('/detection', serveHtml("detection.html"));