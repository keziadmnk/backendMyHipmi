const { Pengurus } = require("../models/PengurusModel");
const { Bidang } = require("../models/BidangModel");
const { JadwalPiket } = require("../models/JadwalPiketModel");
const sequelize = require("../config/db");

const seedPengurus = async () => {
  try {
    await sequelize.sync();

    const bidangList = await Bidang.findAll();
    if (bidangList.length === 0) {
      throw new Error(
        "Bidang belum di-seed. Jalankan seedBidang terlebih dahulu!"
      );
    }

    const bidangMap = {};
    bidangList.forEach((bidang) => {
      bidangMap[bidang.nama_bidang] = bidang.id_bidang;
    });

    const jadwallist = await JadwalPiket.findAll();
    if (jadwallist.length === 0) {
      throw new Error(
        "Jadwal piket belum di-seed. Jalankan seedJadwalPiket terlebih dahulu!"
      );
    }

    const jadwalMap = {};
    jadwallist.forEach((jadwal) => {
      jadwalMap[jadwal.hari_piket] = jadwal.id_jadwal_piket;
    });


    const pengurusData = [
      {
        id_bidang: bidangMap["Ketua Umum"],
        id_jadwal_piket: jadwalMap["Senin"],
        nama_pengurus: "Ahmad Fauzi",
        email_pengurus: "ahmad.fauzi@hipmi.com",
        password: "password123",
        jabatan: "Ketua Umum",
        nomor_hp: "081234567890",
        alamat: "Jl. Contoh No. 123, Jakarta",
      },
      {
        id_bidang: bidangMap["Sekretaris"],
        id_jadwal_piket: jadwalMap["Selasa"],
        nama_pengurus: "Siti Nurhaliza",
        email_pengurus: "siti.nurhaliza@hipmi.com",
        password: "password123",
        jabatan: "Sekretaris",
        nomor_hp: "081234567891",
        alamat: "Jl. Contoh No. 456, Jakarta",
      },
      {
        id_bidang: bidangMap["Bendahara"],
        id_jadwal_piket: jadwalMap["Rabu"],
        nama_pengurus: "Budi Santoso",
        email_pengurus: "budi.santoso@hipmi.com",
        password: "password123",
        jabatan: "Bendahara",
        nomor_hp: "081234567892",
        alamat: "Jl. Contoh No. 789, Jakarta",
      },
      {
        id_bidang: bidangMap["Bidang Organisasi"],
        id_jadwal_piket: jadwalMap["Kamis"],
        nama_pengurus: "Dewi Sartika",
        email_pengurus: "dewi.sartika@hipmi.com",
        password: "password123",
        jabatan: "Koordinator Bidang Organisasi",
        nomor_hp: "081234567893",
        alamat: "Jl. Contoh No. 321, Jakarta",
      },
      {
        id_bidang: bidangMap["Bidang Kaderisasi"],
        id_jadwal_piket: jadwalMap["Jumat"],
        nama_pengurus: "Eko Prasetyo",
        email_pengurus: "eko.prasetyo@hipmi.com",
        password: "password123",
        jabatan: "Koordinator Bidang Kaderisasi",
        nomor_hp: "081234567894",
        alamat: "Jl. Contoh No. 654, Jakarta",
      },
      {
        id_bidang: bidangMap["Bidang Humas"],
        id_jadwal_piket: jadwalMap["Senin"],
        nama_pengurus: "Fitri Handayani",
        email_pengurus: "fitri.handayani@hipmi.com",
        password: "password123",
        jabatan: "Koordinator Bidang Humas",
        nomor_hp: "081234567895",
        alamat: "Jl. Contoh No. 987, Jakarta",
      },
      {
        id_bidang: bidangMap["Bidang Media"],
        id_jadwal_piket: jadwalMap["Selasa"],
        nama_pengurus: "Gunawan Wijaya",
        email_pengurus: "gunawan.wijaya@hipmi.com",
        password: "password123",
        jabatan: "Koordinator Bidang Media",
        nomor_hp: "081234567896",
        alamat: "Jl. Contoh No. 147, Jakarta",
      },
      {
        id_bidang: bidangMap["Bidang Pendidikan"],
        id_jadwal_piket: jadwalMap["Rabu"],
        nama_pengurus: "Hani Lestari",
        email_pengurus: "hani.lestari@hipmi.com",
        password: "password123",
        jabatan: "Koordinator Bidang Pendidikan",
        nomor_hp: "081234567897",
        alamat: "Jl. Contoh No. 258, Jakarta",
      },
    ];

    await Pengurus.destroy({ where: {} });

    await Pengurus.bulkCreate(pengurusData, { individualHooks: true });

    console.log("✅ Seed Pengurus berhasil!");
    console.log(
      "📝 Catatan: Password di seeder adalah plain text, tetapi sudah ter-hash di database"
    );
    return pengurusData;
  } catch (error) {
    console.error("❌ Error seeding Pengurus:", error);
    throw error;
  }
};

module.exports = { seedPengurus };
