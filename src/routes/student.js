import express from "express";
import { authenticateUser, authorizeRoles } from "../middlewares/authenticateUser.js";
import { getStudentProfile } from "../controllers/studentController.js";
const router = express.Router();

// Session-based authentication & role check
router.get("/", authenticateUser, authorizeRoles("student"), (req, res) => {
  res.json({ message: "Welcome to Student Home" });
});

router.get("/borrowed-books", authenticateUser, authorizeRoles("student"), (req, res) => {
  res.json({ message: "Your Borrowed Books" });
});
// profile details
router.get("/profile", getStudentProfile );

export default router;

