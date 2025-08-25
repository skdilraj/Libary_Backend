import express from "express";
import { authenticateUser, authorizeRoles } from "../middlewares/authenticateUser.js";
import {
  getPendingRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/librarianController.js";

const router = express.Router();

// Session-based authentication & role check
router.get("/home", authenticateUser, authorizeRoles("librarian"), (req, res) => {
  res.json({ message: "Welcome to Librarian Home" });
});

router.get("/manage-books", authenticateUser, authorizeRoles("librarian"), (req, res) => {
  res.json({ message: "Manage Books Page" });
});



// Get all pending requests
router.get("/getAllRequest", authenticateUser, authorizeRoles("librarian"), getPendingRequests);

// Approve request
router.put("/:requestId/approve", authenticateUser, authorizeRoles("librarian"), approveRequest);

// Reject request
router.put("/:requestId/reject", authenticateUser, authorizeRoles("librarian"), rejectRequest);



export default router;
