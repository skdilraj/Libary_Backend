// models/User.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true ,trim: true,index:true},
  email: { type: String, required: true, unique: true ,trim: true,index:true},
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'librarian', 'student'],
    required: true
  },
  profileImage: { type: String, default: '' },
  
  // Reference to role-specific profile
  profileRef: {
    type: Schema.Types.ObjectId,
    refPath: 'roleProfileRef'
  },

  // Dynamic ref path: tells Mongoose which model to use
  roleProfileRef: {
    type: String,
    required: true,
    enum: ['AdminProfile', 'LibrarianProfile', 'StudentProfile'] // collections name
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
