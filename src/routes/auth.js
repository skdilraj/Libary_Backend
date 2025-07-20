import express from "express";
import { registerStudent, loginUser } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register/student
router.post("/register/student", registerStudent);

// POST /api/auth/login
router.post("/login", loginUser);

export default router;
