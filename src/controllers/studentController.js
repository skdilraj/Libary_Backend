import StudentProfile from "../model/student.model.js";

// Fetch logged-in student's profile (name, email, rollNumber)
export const getStudentProfile = async (req, res) => {
  try {
    // Ensure session exists
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const { profileRef } = req.session.user; // Student._id from session

    // Find the student by profileRef
    const student = await StudentProfile.findById(profileRef)
      .populate("user", "name email profileImage")   // fetch name & email from User
      .select("rollNumber user");       // fetch rollNumber + user only

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Flatten response
    res.status(200).json({
      roll: student.rollNumber,
      name: student.user?.name,
      email: student.user?.email,
      img: student.user?.profileImage,
    });

  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Error fetching student profile", error });
  }
};
