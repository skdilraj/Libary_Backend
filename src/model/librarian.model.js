import mongoose from "mongoose";
const Schema = mongoose.Schema;

const librarianSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  memberId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  highestQualification: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model("LibrarianProfile", librarianSchema);
