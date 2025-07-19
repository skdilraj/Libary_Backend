// models/StudentProfile.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const studentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number, // 1, 2, 3, 4
        required: true
    }
});

module.exports = mongoose.model('StudentProfile', studentSchema);
