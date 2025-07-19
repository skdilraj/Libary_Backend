import mongoose from "mongoose";
const Schema = mongoose.Schema;
const librarianSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    officePhone: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('LibrarianProfile', librarianSchema);