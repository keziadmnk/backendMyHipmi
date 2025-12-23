const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agendaController");

router.get("/", agendaController.getAllAgenda);

router.get("/:id", agendaController.getAgendaById);

router.get("/pengurus/:id_pengurus", agendaController.getAgendaByPengurus);

router.post("/", agendaController.createAgenda);

router.put("/:id", agendaController.updateAgenda);

router.delete("/:id", agendaController.deleteAgenda);

module.exports = router;
