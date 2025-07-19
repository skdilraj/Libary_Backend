import mongoose from "mongoose";

const Schema = mongoose.Schema;
const bookIssueSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User', // referencing user with role: 'student'
        required: true
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
        default: 'pending'
    },
    issuedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // referencing user with role: 'librarian'
        required: true
    },
    issueDate: {
        type: Date,
    },
    dueDate: {
        type: Date,
    },
    returnDate: {
        type: Date
    },
});

module.exports = mongoose.model('BookIssue', bookIssueSchema);
