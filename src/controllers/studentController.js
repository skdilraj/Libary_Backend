import StudentProfile from "../model/student.model.js";
import Book from "../model/book.model.js";
import BookIssue from "../model/bookIssue.model.js";

// Fetch logged-in student's profile (name, email, rollNumber)
export const getStudentProfile = async (req, res) => {
  try {
    // Ensure session exists
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const { profileRef } = req.session.user; // Student._id from session

    // Find the student by profileRef
    const student = await StudentProfile.findById(profileRef)
      .populate("user", "name email profileImage")   // fetch name & email from User
      .select("rollNumber user");       // fetch rollNumber + user only

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Flatten response
    res.status(200).json({
      roll: student.rollNumber,
      name: student.user?.name,
      email: student.user?.email,
      img: student.user?.profileImage,
    });

  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Error fetching student profile", error });
  }
};



// ✅ Fetch books by category (no book id needed)
export const getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    let books;

    if (!category || category === "All" || category === "All Books") {
      books = await Book.find().lean();
    } else {
      books = await Book.find({ category }).lean();
    }


    res.status(200).json({
      category: category || "All",
      total: books.length,
      books
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const requestBook = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { bookId } = req.body;
    const studentId = req.user._id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check availability
    if (book.copiesAvailable <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    // 🔹 Prevent duplicate borrow requests
    const existingRequest = await BookIssue.findOne({
      book: bookId,
      student: studentId,
      status: { $in: ["pending", "approved"] } // pending or already approved
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You already requested or borrowed this book" });
    }

    // Create borrow request
    const newIssue = new BookIssue({
      book: bookId,
      student: studentId,
      status: "pending",
      requestDate: new Date(),
      // issuedBy is optional
    });

    await newIssue.save();

    res.status(201).json({ message: "Borrow request submitted", issue: newIssue });
  } catch (err) {
    console.error("Error requesting book:", err);
    res.status(500).json({ message: "Server error" });
  }
};
