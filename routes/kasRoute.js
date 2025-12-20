const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middlewares/uploadKas");
const {
  getKasList,
  createKas,
  updateKas,
  deleteKas,
  getKasById,
} = require("../controllers/kasController");

// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File terlalu besar. Maksimal 5MB",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

// Routes
router.get("/", getKasList);
router.post("/", upload.single("file"), handleMulterError, createKas);
router.get("/:id", getKasById);
router.put("/:id", updateKas);
router.delete("/:id", deleteKas);

module.exports = router;
