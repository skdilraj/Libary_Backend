// models/Book.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    index:true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  totalCopies: {
    type: Number,
    required: true
  },
  copiesAvailable: {
    type: Number,
    required: true
  },
  bookImage: {
    type: String, // Stores the Cloudinary URL
    default: ''   // optional
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
