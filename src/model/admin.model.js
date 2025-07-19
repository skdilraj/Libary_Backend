import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: String,
        required: true
    },
    officePhone: {
        type: String, required: true , unique: true,trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AdminProfile', adminProfileSchema);