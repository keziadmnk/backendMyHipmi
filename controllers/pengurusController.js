const { Pengurus } = require("../models/PengurusModel");
const { JadwalPiket } = require("../models/JadwalPiketModel");

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

exports.updatePengurus = async (req, res) => {
  try {
    const { id_pengurus } = req.params;
    const { nomor_hp, alamat } = req.body;

    // Cari pengurus berdasarkan ID
    const pengurus = await Pengurus.findByPk(id_pengurus);

    if (!pengurus) {
      return res.status(404).json({
        success: false,
        message: "Pengurus tidak ditemukan",
      });
    }

    // Update hanya field yang boleh diubah
    const updateData = {};
    if (nomor_hp !== undefined) updateData.nomor_hp = nomor_hp;
    if (alamat !== undefined) updateData.alamat = alamat;

    await pengurus.update(updateData);

    // Ambil data pengurus yang sudah diupdate dengan jadwal piket
    const updatedPengurus = await Pengurus.findByPk(id_pengurus, {
      include: [
        {
          model: JadwalPiket,
          as: "JadwalPiket",
          attributes: ["id_jadwal_piket", "hari_piket"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Profile berhasil diperbarui",
      data: updatedPengurus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui profile",
      error: error.message,
    });
  }
};

