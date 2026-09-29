const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ======================================
// UPLOAD DIRECTORY
// ======================================

const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "resumes"
);

console.log("UPLOAD DIRECTORY:", uploadDir);

// ======================================
// ENSURE DIRECTORY EXISTS
// ======================================

const ensureUploadDir = () => {
  // ======================================
// TEST FILE WRITE
// ======================================

try {
  const testFilePath = path.join(
    uploadDir,
    "test-upload.txt"
  );

  fs.writeFileSync(
    testFilePath,
    "UPLOAD DIRECTORY TEST"
  );

  console.log(
    "✅ TEST FILE CREATED:",
    testFilePath
  );

  fs.unlinkSync(testFilePath);

  console.log(
    "✅ TEST FILE DELETED"
  );

} catch (error) {
  console.error(
    "❌ TEST FILE WRITE FAILED:",
    error
  );
}
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });

      console.log(
        "✅ UPLOAD DIRECTORY CREATED"
      );
    }

    console.log(
      "📁 DIRECTORY EXISTS:",
      fs.existsSync(uploadDir)
    );

  } catch (error) {
    console.error(
      "❌ DIRECTORY CREATION ERROR:",
      error
    );

    throw error;
  }
};

// Create once when server starts
ensureUploadDir();

// ======================================
// STORAGE
// ======================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("🔥 MULTER DESTINATION REACHED");
    console.log("UPLOAD DIR:", uploadDir);

    try {
      ensureUploadDir();

      // Confirm directory exists
      if (!fs.existsSync(uploadDir)) {
        return cb(
          new Error("Upload directory does not exist")
        );
      }

      console.log(
        "✅ DIRECTORY READY:",
        uploadDir
      );

      cb(null, uploadDir);
    } catch (error) {
      console.error(
        "❌ DESTINATION ERROR:",
        error
      );

      cb(error);
    }
  },

  filename: (req, file, cb) => {
    console.log("🔥 MULTER FILENAME REACHED");
    console.log(
      "ORIGINAL FILE:",
      file.originalname
    );

    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.pdf`;

    const finalPath = path.join(
      uploadDir,
      uniqueName
    );

    console.log(
      "SAVED FILE NAME:",
      uniqueName
    );

    console.log(
      "FINAL FILE PATH:",
      finalPath
    );

    cb(null, uniqueName);
  },
});

// ======================================
// FILE FILTER
// ======================================

const fileFilter = (
  req,
  file,
  cb
) => {

  console.log(
    "🔥 FILE FILTER REACHED"
  );

  console.log(
    "FILE NAME:",
    file.originalname
  );

  console.log(
    "MIME TYPE:",
    file.mimetype
  );

  const extension =
    path
      .extname(
        file.originalname
      )
      .toLowerCase();

  const isPdf =
    file.mimetype ===
      "application/pdf" &&
    extension === ".pdf";

  if (isPdf) {

    console.log(
      "✅ PDF ACCEPTED"
    );

    cb(null, true);

  } else {

    console.log(
      "❌ PDF REJECTED"
    );

    cb(
      new Error(
        "Only PDF files are allowed"
      )
    );
  }
};

// ======================================
// MULTER
// ======================================

const uploadResumeMulter =
  multer({
    storage,
    fileFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });

// ======================================
// UPLOAD MIDDLEWARE
// ======================================

const uploadResume = (
  req,
  res,
  next
) => {

  console.log(
    "🔥🔥 UPLOAD MIDDLEWARE START"
  );
  

  uploadResumeMulter.single(
    "resume"
  )(
    req,
    res,
    (error) => {

      console.log(
        "🔥🔥 MULTER CALLBACK REACHED"
      );

      if (error) {

        console.error(
          "❌ MULTER ERROR:",
          error
        );

        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      console.log(
        "✅ MULTER COMPLETED"
      );

      console.log(
        "UPLOADED FILE:",
        req.file
      );

      next();
    }
  );
};

// ======================================
// EXPORT
// ======================================

module.exports = {
  uploadResume,
};