import express from "express";
import { loginUser, logoutUser } from "../controllers/authController.js";

const router = express.Router();


// Login User (saves session)
router.post("/login", loginUser);

// Logout User (destroys session)
router.post("/logout", logoutUser);

// GET current user session
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  return res.json({ user: req.session.user });
});

export default router;
