// models/User.js
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true ,trim: true,index:true},
  email: { type: String, required: true, unique: true ,trim: true},
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
  //
  refreshToken: {
    type: String
  },
  // Dynamic ref path: tells Mongoose which model to use
  roleProfileRef: {
    type: String,
    required: true,
    enum: ['AdminProfile', 'LibrarianProfile', 'StudentProfile'] // collections name
  },
   refreshToken: {
    type: String
  }
}, { timestamps: true });

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema);

