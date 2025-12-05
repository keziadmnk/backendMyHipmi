const AbsenRapat = require("../models/AbsenRapatModel");
const AgendaRapat = require("../models/AgendaRapatModel");
const { Pengurus } = require("../models/PengurusModel");
const { getWIBTime } = require("../utils/timeHelper");

// GET semua absen rapat
exports.getAllAbsen = async (req, res) => {
  try {
    const absens = await AbsenRapat.findAll({
      include: [
        {
          model: AgendaRapat,
          as: "Agenda",
          attributes: ["id_agenda", "title", "date", "startAt", "location"],
        },
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus", "jabatan"],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: absens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data absen rapat",
      error: error.message,
    });
  }
};

// GET absen berdasarkan agenda
exports.getAbsenByAgenda = async (req, res) => {
  try {
    const { id_agenda } = req.params;

    const absens = await AbsenRapat.findAll({
      where: { id_agenda },
      include: [
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus", "jabatan", "profil_foto"],
        },
      ],
      order: [["timestamp", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: absens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data absen rapat",
      error: error.message,
    });
  }
};

// GET absen berdasarkan pengurus
exports.getAbsenByPengurus = async (req, res) => {
  try {
    const { id_pengurus } = req.params;

    const absens = await AbsenRapat.findAll({
      where: { id_pengurus },
      include: [
        {
          model: AgendaRapat,
          as: "Agenda",
          attributes: ["id_agenda", "title", "date", "startAt", "location"],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: absens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data absen rapat",
      error: error.message,
    });
  }
};

// POST - Buat absen rapat (untuk absen kehadiran)
exports.createAbsen = async (req, res) => {
  try {
    const { id_agenda, id_pengurus, photobuktiUrl, status } = req.body;

    // Validasi input
    if (!id_agenda || !id_pengurus) {
      return res.status(400).json({
        success: false,
        message: "id_agenda dan id_pengurus harus diisi",
      });
    }

    // Cek apakah agenda exist
    const agenda = await AgendaRapat.findByPk(id_agenda);
    if (!agenda) {
      return res.status(404).json({
        success: false,
        message: "Agenda rapat tidak ditemukan",
      });
    }

    // Cek apakah pengurus exist
    const pengurus = await Pengurus.findByPk(id_pengurus);
    if (!pengurus) {
      return res.status(404).json({
        success: false,
        message: "Pengurus tidak ditemukan",
      });
    }

    // Cek apakah sudah absen sebelumnya
    const existingAbsen = await AbsenRapat.findOne({
      where: { id_agenda, id_pengurus },
    });

    if (existingAbsen) {
      return res.status(400).json({
        success: false,
        message: "Anda sudah melakukan absen untuk rapat ini",
      });
    }

    // Buat absen baru dengan waktu WIB
    const newAbsen = await AbsenRapat.create({
      id_agenda,
      id_pengurus,
      timestamp: getWIBTime(),
      photobuktiUrl: photobuktiUrl || null,
      status: status || "present",
    });

    // Update agenda menjadi isDone = true (rapat sudah dimulai/berlangsung)
    await agenda.update({ isDone: true });

    // Ambil data lengkap
    const absenWithDetails = await AbsenRapat.findByPk(newAbsen.id_absenRapat, {
      include: [
        {
          model: AgendaRapat,
          as: "Agenda",
          attributes: ["id_agenda", "title", "date", "startAt", "isDone"],
        },
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Absen rapat berhasil dicatat",
      data: absenWithDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal membuat absen rapat",
      error: error.message,
    });
  }
};

// PUT - Update absen (misal update status atau foto bukti)
exports.updateAbsen = async (req, res) => {
  try {
    const { id } = req.params;
    const { photobuktiUrl, status } = req.body;

    const absen = await AbsenRapat.findByPk(id);

    if (!absen) {
      return res.status(404).json({
        success: false,
        message: "Data absen tidak ditemukan",
      });
    }

    await absen.update({
      photobuktiUrl: photobuktiUrl || absen.photobuktiUrl,
      status: status || absen.status,
    });

    res.status(200).json({
      success: true,
      message: "Data absen berhasil diupdate",
      data: absen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate data absen",
      error: error.message,
    });
  }
};

// DELETE - Hapus absen
exports.deleteAbsen = async (req, res) => {
  try {
    const { id } = req.params;

    const absen = await AbsenRapat.findByPk(id);

    if (!absen) {
      return res.status(404).json({
        success: false,
        message: "Data absen tidak ditemukan",
      });
    }

    await absen.destroy();

    res.status(200).json({
      success: true,
      message: "Data absen berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus data absen",
      error: error.message,
    });
  }
};
