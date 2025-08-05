import User from "../model/user.model.js";
import StudentProfile from "../model/student.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Import the utility

export default async function AddStudent(req, res) {
  try {
    // 1. Destructure text fields from req.body
    const { name, email, roll, department, year } = req.body;
    
    // Generate a temporary password (you should get this from the form)
    const password = `${name.split(' ')[0]}@${roll}`;

    // 2. Validate required fields
    if (!name || !email || !roll || !department || !year) {
      return res.status(400).json({ error: 'All text fields are required' });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    // 4. Handle the file upload to Cloudinary
    let profileImageUrl = ""; // Default to empty string
    if (req.file) {
      const localFilePath = req.file.path;
      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

      if (cloudinaryResponse && cloudinaryResponse.url) {
        profileImageUrl = cloudinaryResponse.url; // Get the secure URL
      } else {
        // If upload fails, you can decide to stop or continue without an image
        console.error("Could not upload profile image to Cloudinary.");
      }
    }
    
    // 5. Create the new User document with the Cloudinary URL
    const newUser = new User({
      name,
      email,
      password,
      role: 'student',
      roleProfileRef: 'StudentProfile',
      profileImage: profileImageUrl, // Save the URL from Cloudinary
    });

    // 6. Create the StudentProfile document
    const studentProfile = new StudentProfile({
      user: newUser._id,
      rollNumber: roll,
      department,
      year,
    });
    
    newUser.profileRef = studentProfile._id;

    // 7. Save both documents to the database
    await newUser.save();
    await studentProfile.save();

    res.status(201).json({ 
        message: 'Student created successfully!', 
        studentId: newUser._id 
    });

  } catch (error) {
    console.error('ERROR CREATING STUDENT:', error);
    res.status(500).json({ error: 'Server error while creating student.' });
  }
}