// This is the controller function for adding a new book.
// The final fix is adding the import statement for the Book model.

import Book from "../model/book.model.js"; // <-- THE FIX IS HERE: Make sure this path is correct
import { uploadOnCloudinary } from "../utils/cloudinary.js"; 

export const addBook = async (req, res) => {
    try {
        // 1. Extract data from the request.
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

        // 2. Validate the essential fields.
        if (!title || !author || !isbn || !totalQuantity) {
            return res.status(400).json({ error: "Title, author, ISBN, and quantity are required." });
        }
        
        const quantityToAdd = parseInt(totalQuantity, 10);
        if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
            return res.status(400).json({ error: "Please provide a valid, positive quantity." });
        }

        // 3. Check if a book with the same ISBN already exists.
        // This line will now work because 'Book' is imported.
        const existingBook = await Book.findOne({ isbn });

        // --- LOGIC FOR UPDATING AN EXISTING BOOK ---
        if (existingBook) {
            existingBook.totalCopies += quantityToAdd;
            existingBook.copiesAvailable += quantityToAdd;

            await existingBook.save();

            return res.status(200).json({
                message: `Quantity for '${existingBook.title}' updated successfully.`,
                book: existingBook
            });
        }

        // --- LOGIC FOR CREATING A NEW BOOK ---
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
            totalCopies: quantityToAdd,
            copiesAvailable: quantityToAdd,
            resourceType,
            category,
            publisherName,
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
