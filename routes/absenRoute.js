const express = require("express");
const router = express.Router();
const absenController = require("../controllers/absenController");

router.get("/", absenController.getAllAbsen);

router.get("/agenda/:id_agenda", absenController.getAbsenByAgenda);

router.get("/pengurus/:id_pengurus", absenController.getAbsenByPengurus);

router.post("/", absenController.createAbsen);

router.put("/:id", absenController.updateAbsen);

router.delete("/:id", absenController.deleteAbsen);

module.exports = router;
