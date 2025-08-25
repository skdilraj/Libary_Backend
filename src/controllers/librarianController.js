import BookIssue from "../model/bookIssue.model.js";
import Book from "../model/book.model.js";
import User from "../model/user.model.js";
import { sendEmail } from "../utils/email.js";
/**
 * Get all pending borrow requests
 */
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await BookIssue.find({ status: "pending" })
      .populate("book", "title author")
      .populate("student", "name email");

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Approve (Grant) a borrow request
 */


export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const librarianId = req.user.id; // assuming JWT middleware stores logged-in user

    const request = await BookIssue.findById(requestId)
      .populate("book")
      .populate("student"); // make sure to populate student to get email

    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Request already ${request.status}` });
    }

    // Check availability
    if (request.book.copiesAvailable <= 0) {
      return res
        .status(400)
        .json({ message: "No copies available for this book" });
    }

    // Update book availability
    request.book.copiesAvailable -= 1;
    await request.book.save();

    // Approve request
    request.status = "approved";
    request.issuedBy = librarianId;
    request.issueDate = new Date();
    request.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks
    await request.save();

    // Send email to student
    if (request.student?.email) {
      try {
        await sendEmail(
          request.student.email,
          " Book Request Approved",
          `<p>Dear ${request.student.name || "Student"},</p>
           <p>Your request for the book <strong>${request.book.title}</strong> has been approved.</p>
           <p><b>Issue Date:</b> ${request.issueDate.toDateString()}</p>
           <p><b>Due Date:</b> ${request.dueDate.toDateString()}</p>
           <p>Please make sure to return the book on time to avoid fines.</p>
           <br/>
           <p>Best Regards,<br/>Library Team</p>`
        );
      } catch (emailError) {
        console.error(" Error sending email:", emailError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Request approved successfully & email sent",
      request,
    });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Reject a borrow request
 */
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const librarianId = req.user.id;

    const request = await BookIssue.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: `Request already ${request.status}` });
    }

    request.status = "rejected";
    request.issuedBy = librarianId;
    await request.save();

    res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      request,
    });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
