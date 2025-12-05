const AgendaRapat = require("../models/AgendaRapatModel");
const { Pengurus } = require("../models/PengurusModel");
const AbsenRapat = require("../models/AbsenRapatModel");

// GET semua agenda rapat
exports.getAllAgenda = async (req, res) => {
  try {
    const { id_pengurus } = req.query; // Ambil id_pengurus dari query parameter

    const agendas = await AgendaRapat.findAll({
      include: [
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus", "jabatan"],
        },
        {
          model: AbsenRapat,
          as: "Absensis",
          attributes: ["id_absenRapat", "id_pengurus", "status", "timestamp"],
        },
      ],
      order: [["date", "DESC"], ["startAt", "DESC"]],
    });

    // Tambahkan info hasAttended jika id_pengurus dikirim
    const agendasWithAttendance = agendas.map(agenda => {
      const agendaData = agenda.toJSON();
      if (id_pengurus) {
        const userAbsen = agendaData.Absensis?.find(
          absen => absen.id_pengurus == id_pengurus
        );
        agendaData.hasAttended = !!userAbsen;
        agendaData.userAbsenStatus = userAbsen?.status || null;
      }
      return agendaData;
    });

    res.status(200).json({
      success: true,
      data: agendasWithAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data agenda rapat",
      error: error.message,
    });
  }
};

// GET agenda rapat by ID
exports.getAgendaById = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_pengurus } = req.query; // Ambil id_pengurus dari query parameter

    const agenda = await AgendaRapat.findByPk(id, {
      include: [
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus", "jabatan"],
        },
        {
          model: AbsenRapat,
          as: "Absensis",
          include: [
            {
              model: Pengurus,
              as: "Pengurus",
              attributes: ["id_pengurus", "nama_pengurus", "email_pengurus"],
            },
          ],
        },
      ],
    });

    if (!agenda) {
      return res.status(404).json({
        success: false,
        message: "Agenda rapat tidak ditemukan",
      });
    }

    // Tambahkan info hasAttended jika id_pengurus dikirim
    const agendaData = agenda.toJSON();
    if (id_pengurus) {
      const userAbsen = agendaData.Absensis?.find(
        absen => absen.id_pengurus == id_pengurus
      );
      agendaData.hasAttended = !!userAbsen;
      agendaData.userAbsenStatus = userAbsen?.status || null;
    }

    res.status(200).json({
      success: true,
      data: agendaData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data agenda rapat",
      error: error.message,
    });
  }
};

// POST - Buat agenda rapat baru
exports.createAgenda = async (req, res) => {
  try {
    const {
      id_pengurus,
      title,
      creatorId,
      creatorName,
      date,
      startAt,
      endAt,
      dateDisplay,
      startTimeDisplay,
      endTimeDisplay,
      location,
      description,
    } = req.body;

    // Validasi input
    if (!id_pengurus || !title || !creatorId || !creatorName || !date || !startAt || !endAt) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap. Harap isi semua field yang diperlukan",
      });
    }

    const newAgenda = await AgendaRapat.create({
      id_pengurus,
      title,
      creatorId,
      creatorName,
      date,
      startAt,
      endAt,
      dateDisplay,
      startTimeDisplay,
      endTimeDisplay,
      location,
      description,
      isDone: false,
    });

    res.status(201).json({
      success: true,
      message: "Agenda rapat berhasil dibuat",
      data: newAgenda,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal membuat agenda rapat",
      error: error.message,
    });
  }
};

// PUT - Update agenda rapat
exports.updateAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      date,
      startAt,
      endAt,
      dateDisplay,
      startTimeDisplay,
      endTimeDisplay,
      location,
      description,
      isDone,
    } = req.body;

    const agenda = await AgendaRapat.findByPk(id);

    if (!agenda) {
      return res.status(404).json({
        success: false,
        message: "Agenda rapat tidak ditemukan",
      });
    }

    await agenda.update({
      title: title || agenda.title,
      date: date || agenda.date,
      startAt: startAt || agenda.startAt,
      endAt: endAt || agenda.endAt,
      dateDisplay: dateDisplay || agenda.dateDisplay,
      startTimeDisplay: startTimeDisplay || agenda.startTimeDisplay,
      endTimeDisplay: endTimeDisplay || agenda.endTimeDisplay,
      location: location || agenda.location,
      description: description || agenda.description,
      isDone: isDone !== undefined ? isDone : agenda.isDone,
    });

    res.status(200).json({
      success: true,
      message: "Agenda rapat berhasil diupdate",
      data: agenda,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate agenda rapat",
      error: error.message,
    });
  }
};

// DELETE - Hapus agenda rapat
exports.deleteAgenda = async (req, res) => {
  try {
    const { id } = req.params;

    const agenda = await AgendaRapat.findByPk(id);

    if (!agenda) {
      return res.status(404).json({
        success: false,
        message: "Agenda rapat tidak ditemukan",
      });
    }

    await agenda.destroy();

    res.status(200).json({
      success: true,
      message: "Agenda rapat berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus agenda rapat",
      error: error.message,
    });
  }
};

// GET agenda rapat berdasarkan pengurus
exports.getAgendaByPengurus = async (req, res) => {
  try {
    const { id_pengurus } = req.params;

    const agendas = await AgendaRapat.findAll({
      where: { id_pengurus },
      include: [
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus"],
        },
      ],
      order: [["date", "DESC"], ["startAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: agendas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data agenda rapat",
      error: error.message,
    });
  }
};
