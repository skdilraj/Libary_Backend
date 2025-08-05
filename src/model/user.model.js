import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    index: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true, // Change 1: Store emails in lowercase to prevent duplicates like 'test@test.com' and 'Test@test.com'
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Change 2: Basic email format validation
  },
  password: { 
    type: String, 
    required: true,
    select: false // Change 3: Prevent password from being returned in queries by default for security
  },
  role: {
    type: String,
    enum: ['admin', 'librarian', 'student'],
    required: true
  },
  profileImage: { 
    type: String, 
    default: '' 
  },
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
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for login
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;