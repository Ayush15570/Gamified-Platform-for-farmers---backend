import multer from "multer";
import path from "path";
import os from "os";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use system temp folder instead of custom folders
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });
