import User from "../model/user.model.js";
import StudentProfile from "../model/student.model.js";

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, department, rollNumber, year } = req.body;

    if (!name || !email || !password || !department || !rollNumber || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: "student",
      roleProfileRef: "StudentProfile",
    });

    // Create student profile and link user
    const studentProfile = await StudentProfile.create({
      user: user._id,
      rollNumber,
      department,
      year,
    });

    // Link profile back to user
    user.profileRef = studentProfile._id;
    await user.save();

    res.status(201).json({
      message: "Student registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Save user info to session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileRef: user.profileRef
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.session.user
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};


export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err.message });
    }
    res.clearCookie("connect.sid"); // clear session cookie
    res.json({ message: "Logged out successfully" });
  });
};