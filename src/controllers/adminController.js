// controllers/librarian.controller.js
import User from "../model/user.model.js";
import LibrarianProfile from "../model/librarian.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Import Cloudinary util

export const AddLibrarian = async (req, res) => {
  try {
    // 1. Destructure fields from req.body
    const { name, email, memberId, address, phone, dob, highestQualification } = req.body;

    // Generate a temporary password (same logic as student, you can change if needed)
    const password = `${name.split(' ')[0]}@${memberId}`;

    // 2. Validate required fields
    if (!name || !email || !memberId || !address || !phone || !dob || !highestQualification) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "A user with this email already exists." });
    }

    // 4. Handle profile image upload (optional)
    let profileImageUrl = "";
    if (req.file) {
      const localFilePath = req.file.path;
      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

      if (cloudinaryResponse && cloudinaryResponse.url) {
        profileImageUrl = cloudinaryResponse.url;
      } else {
        console.error("Could not upload profile image to Cloudinary.");
      }
    }

    // 5. Create the User document
    const newUser = new User({
      name,
      email,
      password,
      role: "librarian",
      roleProfileRef: "LibrarianProfile",
      profileImage: profileImageUrl,
    });

    // 6. Create LibrarianProfile document
    const librarianProfile = new LibrarianProfile({
      user: newUser._id,
      memberId,
      address,
      phone,
      dob,
      highestQualification,
    });

    // Link user → librarianProfile
    newUser.profileRef = librarianProfile._id;

    // 7. Save both documents
    await newUser.save();
    await librarianProfile.save();

    res.status(201).json({
      message: "Librarian created successfully!",
      librarianId: newUser._id,
    });
  } catch (error) {
    console.error("ERROR CREATING LIBRARIAN:", error);
    res.status(500).json({ error: "Server error while creating librarian." });
  }
}
export const getAllLibrarian = async (req, res) => {
  try {
    // Fetch all librarian profiles and populate their linked User
    const members = await LibrarianProfile.find()
      .populate("user", "name email") // get name and email from User
      .select("memberId user");       // select memberId and user only

    if (!members || members.length === 0) {
      return res.status(404).json({ message: "No librarian profiles found" });
    }

    // Format the response
    const formattedMembers = members.map((member) => ({
      memberId: member.memberId,
      name: member.user?.name,
      email: member.user?.email,
    }));

    res.status(200).json({
      success: true,
      total: formattedMembers.length,
      members: formattedMembers,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Error fetching librarian profiles", error });
  }
};
