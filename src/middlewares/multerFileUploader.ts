import multer from "multer";
import path from "path";
// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
const uploadProfileImage = upload.single("profileImage");



// Export file uploader methods
export const fileUploader = {
  upload,
  uploadProfileImage,
};
