import Book from "../model/book.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      totalQuantity,
      resourceType,
      category,
      publisherName
    } = req.body;

    const addedByUserId = req.session.user._id;

    if (!title || !author || !isbn || !totalQuantity) {
      return res.status(400).json({ error: "Title, author, ISBN, and quantity are required." });
    }

    const quantityToAdd = parseInt(totalQuantity, 10);
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      return res.status(400).json({ error: "Please provide a valid, positive quantity." });
    }

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn });

    if (existingBook) {
      existingBook.totalCopies += quantityToAdd;
      existingBook.copiesAvailable += quantityToAdd;
      await existingBook.save();

      return res.status(200).json({
        message: `Quantity for '${existingBook.title}' updated successfully.`,
        book: existingBook
      });
    }

    // New book → need extra fields
    if (!resourceType || !category || !publisherName) {
      return res.status(400).json({ error: "Resource type, category, and publisher name are required for a new book." });
    }

    let bookImageUrl = "";
    if (req.file) {
      const localFilePath = req.file.path;
      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
      if (cloudinaryResponse && cloudinaryResponse.url) {
        bookImageUrl = cloudinaryResponse.url;
      }
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      publisherName,
      resourceType,
      category,
      totalCopies: quantityToAdd,
      copiesAvailable: quantityToAdd,
      bookImage: bookImageUrl,
      addedBy: addedByUserId
    });

    await newBook.save();

    res.status(201).json({
      message: "New book added successfully!",
      book: newBook
    });

  } catch (error) {
    console.error("ERROR ADDING/UPDATING BOOK:", error);
    res.status(500).json({ error: "Server error while processing the book." });
  }
};
