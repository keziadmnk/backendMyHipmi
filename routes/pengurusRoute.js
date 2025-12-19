const express = require("express");
const router = express.Router();
const pengurusController = require("../controllers/pengurusController");

// GET - Ambil pengurus berdasarkan ID
router.get("/:id_pengurus", pengurusController.getPengurusById);

// PUT - Update profile pengurus (nomor HP dan alamat)
router.put("/:id_pengurus", pengurusController.updatePengurus);

module.exports = router;

