import express from "express";
import { googleLogin } from "../controller/user/google.controller.js";

const router = express.Router();

router.post("/google", googleLogin);

export default router;
