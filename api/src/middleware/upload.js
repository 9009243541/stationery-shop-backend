// const multer = require("multer");
// const path = require("path");

// // Common storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Ensure this folder exists
//   },
//   filename: function (req, file, cb) {  
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// // Original file filter (images only)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf|webp/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .jpg, .jpeg, .png allowed"));
//   }
// };

// // ✅ This keeps old behavior working for other APIs
// const upload = multer({ storage, fileFilter });

// // New filter for images + videos
// const mediaFileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|pdf|webp|mp4|mov|avi|mkv/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image/video formats allowed"));
//   }
// };

// // ✅ This is for your blogs API with video
// const uploadMedia = multer({ storage, fileFilter: mediaFileFilter });

// // Default export = old `upload` so existing code still works
// // Named export = `uploadMedia` for new usage
// module.exports = upload;
// module.exports.uploadMedia = uploadMedia;


// neeche vala better he 

const multer = require("multer");
const path = require("path");

// Common storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Original file filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png|pdf|webp/;
  const extname = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/jpeg|image\/jpg|image\/png|application\/pdf|image\/webp/.test(
    file.mimetype
  );

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png, .pdf, .webp allowed"), false);
  }
};

// ✅ This keeps old behavior working for other APIs
const upload = multer({ storage, fileFilter });

// New filter for images + videos
const mediaFileFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png|pdf|webp|mp4|mov|avi|mkv/;
  const extname = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/jpeg|image\/jpg|image\/png|application\/pdf|image\/webp|video\/mp4|video\/quicktime|video\/x-msvideo|video\/x-matroska/.test(
    file.mimetype
  );

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image/video formats allowed"), false);
  }
};

// ✅ This is for your gallery/blogs API with video support
const uploadMedia = multer({ storage, fileFilter: mediaFileFilter });

// Default export = old `upload` so existing code still works
// Named export = `uploadMedia` for new usage
module.exports = upload;
module.exports.uploadMedia = uploadMedia;
