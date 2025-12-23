const AbsenPiket = require("../models/AbsenPiketModel");
const { Pengurus } = require("../models/PengurusModel");
const { JadwalPiket } = require("../models/JadwalPiketModel");

exports.createAbsenPiket = async (req, res) => {
  try {
    const {
      id_pengurus,
      id_jadwal_piket,
      tanggal_absen,
      jam_mulai,
      jam_selesai,
      keterangan,
      foto_bukti,
    } = req.body;

    if (!id_pengurus || !id_jadwal_piket || !tanggal_absen || !jam_mulai || !jam_selesai || !keterangan || !foto_bukti) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi: id_pengurus, id_jadwal_piket, tanggal_absen, jam_mulai, jam_selesai, keterangan, dan foto_bukti",
      });
    }

    const pengurus = await Pengurus.findByPk(id_pengurus);
    if (!pengurus) {
      return res.status(404).json({
        success: false,
        message: "Pengurus tidak ditemukan",
      });
    }

    const jadwalPiket = await JadwalPiket.findByPk(id_jadwal_piket);
    if (!jadwalPiket) {
      return res.status(404).json({
        success: false,
        message: "Jadwal piket tidak ditemukan",
      });
    }

    const hariIni = new Date(tanggal_absen);
    const namaHariIndonesia = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const hariSekarang = namaHariIndonesia[hariIni.getDay()];

    if (hariSekarang !== jadwalPiket.hari_piket) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat mengisi absen. Hari piket Anda adalah ${jadwalPiket.hari_piket}, sedangkan hari ini adalah ${hariSekarang}`,
      });
    }

    const existingAbsen = await AbsenPiket.findOne({
      where: {
        id_pengurus: id_pengurus,
        tanggal_absen: tanggal_absen,
      },
    });

    if (existingAbsen) {
      return res.status(400).json({
        success: false,
        message: "Anda sudah melakukan absen piket pada tanggal ini",
      });
    }

    const newAbsenPiket = await AbsenPiket.create({
      id_pengurus,
      id_jadwal_piket,
      tanggal_absen,
      jam_mulai,
      jam_selesai,
      keterangan,
      foto_bukti,
      status_absen: "sudah absen", 
    });

    const absenWithDetails = await AbsenPiket.findByPk(newAbsenPiket.id_absen_piket, {
      include: [
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus"],
        },
        {
          model: JadwalPiket,
          as: "Jadwal",
          attributes: ["id_jadwal_piket", "hari_piket"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Absen piket berhasil dicatat",
      data: absenWithDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal membuat absen piket",
      error: error.message,
    });
  }
};

exports.getAllAbsenPiket = async (req, res) => {
  try {
    const absenPiket = await AbsenPiket.findAll({
      include: [
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus"],
        },
        {
          model: JadwalPiket,
          as: "Jadwal",
          attributes: ["id_jadwal_piket", "hari_piket"],
        },
      ],
      order: [["tanggal_absen", "DESC"], ["jam_mulai", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: absenPiket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data absen piket",
      error: error.message,
    });
  }
};

exports.getAbsenPiketByPengurus = async (req, res) => {
  try {
    const { id_pengurus } = req.params;

    const absenPiket = await AbsenPiket.findAll({
      where: { id_pengurus },
      include: [
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus"],
        },
        {
          model: JadwalPiket,
          as: "Jadwal",
          attributes: ["id_jadwal_piket", "hari_piket"],
        },
      ],
      order: [["tanggal_absen", "DESC"], ["jam_mulai", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: absenPiket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data absen piket",
      error: error.message,
    });
  }
};

exports.getAbsenPiketById = async (req, res) => {
  try {
    const { id_absen_piket } = req.params;

    const absenPiket = await AbsenPiket.findByPk(id_absen_piket, {
      include: [
        {
          model: Pengurus,
          as: "Pengurus",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus"],
        },
        {
          model: JadwalPiket,
          as: "Jadwal",
          attributes: ["id_jadwal_piket", "hari_piket"],
        },
      ],
    });

    if (!absenPiket) {
      return res.status(404).json({
        success: false,
        message: "Absen piket tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: absenPiket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data absen piket",
      error: error.message,
    });
  }
};

