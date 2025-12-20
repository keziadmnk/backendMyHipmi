const { Kas } = require("../models/KasModel");
const { Pengurus } = require("../models/PengurusModel");
const sequelize = require("../config/db");

const seedKas = async () => {
  try {
    await sequelize.sync();

    // Ambil semua pengurus untuk mendapatkan user_id yang valid
    const pengurusList = await Pengurus.findAll();
    if (pengurusList.length === 0) {
      throw new Error(
        "Pengurus belum di-seed. Jalankan seedPengurus terlebih dahulu!"
      );
    }

    const kasData = [
      {
        user_id: pengurusList[0].id_pengurus, // Ahmad Fauzi
        deskripsi: "Iuran Wajib Bulan Oktober 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-10-20T10:00:00Z"),
        status: "pending",
      },
      {
        user_id: pengurusList[0].id_pengurus, // Ahmad Fauzi
        deskripsi: "Iuran Wajib Bulan November 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-11-15T10:30:00Z"),
        status: "lunas",
      },
      {
        user_id: pengurusList[1].id_pengurus, // Siti Nurhaliza
        deskripsi: "Iuran Wajib Bulan November 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-11-16T09:15:00Z"),
        status: "lunas",
      },
      {
        user_id: pengurusList[2].id_pengurus, // Budi Santoso
        deskripsi: "Iuran Wajib Bulan November 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-11-17T14:20:00Z"),
        status: "pending",
      },
      {
        user_id: pengurusList[0].id_pengurus, // Ahmad Fauzi
        deskripsi: "Iuran Wajib Bulan Desember 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-12-05T11:00:00Z"),
        status: "lunas",
      },
      {
        user_id: pengurusList[3].id_pengurus, // Dewi Sartika
        deskripsi: "Iuran Wajib Bulan November 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-11-18T08:45:00Z"),
        status: "ditolak",
      },
      {
        user_id: pengurusList[4].id_pengurus, // Eko Prasetyo
        deskripsi: "Iuran Wajib Bulan Desember 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-12-10T13:30:00Z"),
        status: "pending",
      },
      {
        user_id: pengurusList[1].id_pengurus, // Siti Nurhaliza
        deskripsi: "Iuran Wajib Bulan Desember 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-12-08T10:00:00Z"),
        status: "lunas",
      },
      {
        user_id: pengurusList[5].id_pengurus, // Fitri Handayani
        deskripsi: "Donasi Kegiatan Bakti Sosial",
        nominal: 250000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-12-01T15:00:00Z"),
        status: "lunas",
      },
      {
        user_id: pengurusList[6].id_pengurus, // Gunawan Wijaya
        deskripsi: "Iuran Wajib Bulan Desember 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-12-12T09:30:00Z"),
        status: "pending",
      },
      {
        user_id: pengurusList[7].id_pengurus, // Hani Lestari
        deskripsi: "Iuran Wajib Bulan November 2025",
        nominal: 150000.0,
        bukti_transfer_url: null,
        tanggal: new Date("2025-11-20T16:00:00Z"),
        status: "lunas",
      },
    ];

    // Hapus data lama
    await Kas.destroy({ where: {} });

    // Insert data baru
    await Kas.bulkCreate(kasData);

    console.log("✅ Seed Kas berhasil!");
    console.log(`📝 Total ${kasData.length} data kas berhasil ditambahkan`);
    return kasData;
  } catch (error) {
    console.error("❌ Error seeding Kas:", error);
    throw error;
  }
};

module.exports = { seedKas };
