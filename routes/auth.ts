import { Router } from "express";
import { login, signUp } from "../controllers/auth";

export  const router = Router();

router.route("/login").post(login);
router.route("/signup").post(signUp);