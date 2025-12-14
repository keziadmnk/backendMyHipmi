const { Pengurus } = require("../models/PengurusModel");
const { JadwalPiket } = require("../models/JadwalPiketModel");

// GET - Ambil pengurus berdasarkan ID dengan jadwal piket
exports.getPengurusById = async (req, res) => {
  try {
    const { id_pengurus } = req.params;

    const pengurus = await Pengurus.findByPk(id_pengurus, {
      include: [
        {
          model: JadwalPiket,
          as: "JadwalPiket",
          attributes: ["id_jadwal_piket", "hari_piket"],
        },
      ],
    });

    if (!pengurus) {
      return res.status(404).json({
        success: false,
        message: "Pengurus tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: pengurus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data pengurus",
      error: error.message,
    });
  }
};

