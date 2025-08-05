import User from "../model/user.model.js";
import StudentProfile from "../model/student.model.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email and explicitly select the password to override `select: false`
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and if the password is correct
    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Save user info to the session
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