const express = require("express");
const router = express.Router();
const pengurusController = require("../controllers/pengurusController");

// GET - Ambil pengurus berdasarkan ID
router.get("/:id_pengurus", pengurusController.getPengurusById);

module.exports = router;

