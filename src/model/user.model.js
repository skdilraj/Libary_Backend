import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
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

  // Reference to role-specific profile
  profileRef: {
    type: Schema.Types.ObjectId,
    refPath: 'roleProfileRef'
  },

  refreshToken: {
    type: String
  },

  // Dynamic ref path: tells Mongoose which model to use
  roleProfileRef: {
    type: String,
    required: true,
    enum: ['AdminProfile', 'LibrarianProfile', 'StudentProfile'] // collection names
  }
}, { timestamps: true });

// Instance method: Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

// Instance method: Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

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

const User= mongoose.model('User', userSchema); // ✅ use ES6 if using `type: "module"` in package.json
export default User;