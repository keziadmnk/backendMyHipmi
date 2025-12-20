const express = require("express");
const router = express.Router();
const piketController = require("../controllers/piketController");

// POST - Buat absen piket baru
router.post("/absen", piketController.createAbsenPiket);

// GET - Ambil semua absen piket
router.get("/absen", piketController.getAllAbsenPiket);

// GET - Ambil absen piket berdasarkan pengurus
router.get("/absen/pengurus/:id_pengurus", piketController.getAbsenPiketByPengurus);

// GET - Ambil absen piket berdasarkan ID
router.get("/absen/:id_absen_piket", piketController.getAbsenPiketById);

module.exports = router;

