import express from "express";
import { authenticateUser, authorizeRoles } from "../middlewares/authenticateUser.js";
import AddStudent from "../controllers/addStudent.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { addBook } from "../controllers/addBook.js";
import {getAllLibrarian, AddLibrarian}  from "../controllers/adminController.js"
const router = express.Router();

// Admin-only routes
router.get("/", authenticateUser, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});
router.post("/add-student",upload.single('profileImage'),AddStudent );

router.post("/add-librarian", upload.single("profileImage"), AddLibrarian);

router.get("/all-librarian", getAllLibrarian);

router.post("/add-book",authenticateUser, 
  authorizeRoles("admin"), upload.single('bookImage'), addBook);

router.get("/users", authenticateUser, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin User List" });
});

router.get("/settings", authenticateUser, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin Settings" });
});

export default router;
