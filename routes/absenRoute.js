const express = require("express");
const router = express.Router();
const absenController = require("../controllers/absenController");

// GET semua absen rapat
router.get("/", absenController.getAllAbsen);

// GET absen berdasarkan agenda
router.get("/agenda/:id_agenda", absenController.getAbsenByAgenda);

// GET absen berdasarkan pengurus
router.get("/pengurus/:id_pengurus", absenController.getAbsenByPengurus);

// POST buat absen rapat (absen kehadiran)
router.post("/", absenController.createAbsen);

// PUT update absen rapat
router.put("/:id", absenController.updateAbsen);

// DELETE hapus absen
router.delete("/:id", absenController.deleteAbsen);

module.exports = router;
