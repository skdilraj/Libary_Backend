import express from "express";
import { authenticateUser, authorizeRoles } from "../middlewares/authenticateUser.js";

const router = express.Router();

// Admin-only routes
router.get("/", authenticateUser, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/users", authenticateUser, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin User List" });
});

router.get("/settings", authenticateUser, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin Settings" });
});

export default router;
