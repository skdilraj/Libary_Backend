import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // Node.js File System module

// Configure Cloudinary using your environment variables.
// Note: It's a common convention to use uppercase for these variable names.

cloudinary.config({ 
  cloud_name: 'dwypvj2es', 
  api_key: '198437556184188', 
  api_secret: 'aZpPhV7TNgj4Sy3kBp2NE67JQfk'
});

/**
 * Uploads a file from a local path to Cloudinary
 * @param {string} localFilePath - The path to the file on the local server
 * @returns {object | null} - The Cloudinary response object on success, or null on failure
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("Cloudinary upload failed: No local file path provided.");
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Automatically detect file type
        });

        // File uploaded successfully
        console.log("File successfully uploaded to Cloudinary at: ", response.url);
        
        // Clean up the locally saved temporary file
        fs.unlinkSync(localFilePath); 
        
        return response;

    } catch (error) {
        // This is the main change: If an error occurs, we still need to clean up the file.
        // The original code would crash if the file didn't exist.
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        
        console.error("Error during Cloudinary upload:", error);
        return null; // Return null to indicate that the upload failed
    }
}

// Export the function so it can be used in other files (like your controller)
export { uploadOnCloudinary };
