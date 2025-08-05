// In your middleware file (e.g., /middlewares/multer.js)
import multer from 'multer';

// 1. Create the storage engine and assign it to a const named 'storage'
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

// 2. Export the configured multer instance
export const upload = multer({
    storage: storage, // Now 'storage' is correctly defined
});