import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true,
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
  publisherName: {
    type: String,
    required: true,
    trim: true
  },
  resourceType: {
    type: String,
    required: true,
    enum: [
      "Book",
      "E-Book",
      "Journal",
      "Magazine",
      "Newspaper",
      "Thesis",
      "Reference",
      "Audio-Visual"
    ]
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Science",
      "Technology",
      "Arts",
      "Literature",
      "History",
      "Geography",
      "Philosophy",
      "Religion",
      "Social Science",
      "Language"
    ]
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
    type: String,
    default: ''
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);
