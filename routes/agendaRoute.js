const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agendaController");

// GET semua agenda rapat
router.get("/", agendaController.getAllAgenda);

// GET agenda rapat by ID
router.get("/:id", agendaController.getAgendaById);

// GET agenda rapat berdasarkan pengurus
router.get("/pengurus/:id_pengurus", agendaController.getAgendaByPengurus);

// POST buat agenda rapat baru
router.post("/", agendaController.createAgenda);

// PUT update agenda rapat
router.put("/:id", agendaController.updateAgenda);

// DELETE hapus agenda rapat
router.delete("/:id", agendaController.deleteAgenda);

module.exports = router;
