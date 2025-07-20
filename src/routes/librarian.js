import express from "express";
import { authenticateUser, authorizeRoles } from "../middlewares/authenticateUser.js";

const router = express.Router();

// Session-based authentication & role check
router.get("/home", authenticateUser, authorizeRoles("librarian"), (req, res) => {
  res.json({ message: "Welcome to Librarian Home" });
});

router.get("/manage-books", authenticateUser, authorizeRoles("librarian"), (req, res) => {
  res.json({ message: "Manage Books Page" });
});

export default router;
