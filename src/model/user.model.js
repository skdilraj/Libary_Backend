import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'librarian', 'student'],
    required: true
  },
  profileImage: { type: String, default: '' },

  profileRef: {
    type: Schema.Types.ObjectId,
    refPath: 'roleProfileRef'
  },

  roleProfileRef: {
    type: String,
    required: true,
    enum: ['AdminProfile', 'LibrarianProfile', 'StudentProfile']
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
