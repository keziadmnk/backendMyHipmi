const AbsenRapat = require("../models/AbsenRapatModel");
const AgendaRapat = require("../models/AgendaRapatModel");
const { Pengurus } = require("../models/PengurusModel");
const sequelize = require("../config/db");

const seedAbsen = async () => {
  try {
    await sequelize.sync();

    const agendaList = await AgendaRapat.findAll({ order: [["id_agenda", "ASC"]] });
    if (agendaList.length === 0) {
      throw new Error(
        "Agenda Rapat belum di-seed. Jalankan seedAgenda terlebih dahulu!"
      );
    }

    const pengurusList = await Pengurus.findAll();
    if (pengurusList.length === 0) {
      throw new Error(
        "Pengurus belum di-seed. Jalankan seedPengurus terlebih dahulu!"
      );
    }

    // Ambil ID yang sebenarnya
    const agenda1 = agendaList[0];
    const agenda2 = agendaList[1];
    const agenda3 = agendaList[2];

    const ahmad = pengurusList.find(p => p.email_pengurus === "ahmad.fauzi@hipmi.com");
    const siti = pengurusList.find(p => p.email_pengurus === "siti.nurhaliza@hipmi.com");
    const budi = pengurusList.find(p => p.email_pengurus === "budi.santoso@hipmi.com");
    const dewi = pengurusList.find(p => p.email_pengurus === "dewi.sartika@hipmi.com");
    const eko = pengurusList.find(p => p.email_pengurus === "eko.prasetyo@hipmi.com");
    const fitri = pengurusList.find(p => p.email_pengurus === "fitri.handayani@hipmi.com");
    const gunawan = pengurusList.find(p => p.email_pengurus === "gunawan.wijaya@hipmi.com");
    const hani = pengurusList.find(p => p.email_pengurus === "hani.lestari@hipmi.com");

    // Kasus 1: Rapat Koordinasi Bulanan - Beberapa orang hadir tepat waktu
    const absenRapat1 = [
      {
        id_agenda: agenda1.id_agenda,
        id_pengurus: ahmad.id_pengurus, // Ahmad Fauzi
        timestamp: "2025-12-10 08:55:00",
        photobuktiUrl: "https://example.com/photos/absen1_pengurus1.jpg",
        status: "present",
      },
      {
        id_agenda: agenda1.id_agenda,
        id_pengurus: siti.id_pengurus, // Siti Nurhaliza
        timestamp: "2025-12-10 09:00:00",
        photobuktiUrl: "https://example.com/photos/absen1_pengurus2.jpg",
        status: "present",
      },
      {
        id_agenda: agenda1.id_agenda,
        id_pengurus: budi.id_pengurus, // Budi Santoso
        timestamp: "2025-12-10 09:15:00",
        photobuktiUrl: "https://example.com/photos/absen1_pengurus3.jpg",
        status: "late",
      },
      {
        id_agenda: agenda1.id_agenda,
        id_pengurus: dewi.id_pengurus, // Dewi Sartika
        timestamp: "2025-12-10 09:02:00",
        photobuktiUrl: "https://example.com/photos/absen1_pengurus4.jpg",
        status: "present",
      },
    ];

    // Kasus 2: Rapat Persiapan Event - Ada yang foto tidak valid
    const absenRapat2 = [
      {
        id_agenda: agenda2.id_agenda,
        id_pengurus: siti.id_pengurus, // Siti Nurhaliza (creator)
        timestamp: "2025-12-15 12:50:00",
        photobuktiUrl: "https://example.com/photos/absen2_pengurus2.jpg",
        status: "present",
      },
      {
        id_agenda: agenda2.id_agenda,
        id_pengurus: eko.id_pengurus, // Eko Prasetyo
        timestamp: "2025-12-15 13:05:00",
        photobuktiUrl: "https://example.com/photos/absen2_pengurus5.jpg",
        status: "present",
      },
      {
        id_agenda: agenda2.id_agenda,
        id_pengurus: fitri.id_pengurus, // Fitri Handayani
        timestamp: "2025-12-15 13:20:00",
        photobuktiUrl: null, // Tidak upload foto bukti
        status: "invalid",
      },
      {
        id_agenda: agenda2.id_agenda,
        id_pengurus: gunawan.id_pengurus, // Gunawan Wijaya
        timestamp: "2025-12-15 13:30:00",
        photobuktiUrl: "https://example.com/photos/absen2_pengurus7_blur.jpg",
        status: "invalid",
      },
    ];

    // Kasus 3: Evaluasi Kinerja Semester 1 - Sudah selesai, semua hadir
    const absenRapat3 = [
      {
        id_agenda: agenda3.id_agenda,
        id_pengurus: ahmad.id_pengurus, // Ahmad Fauzi
        timestamp: "2025-11-28 09:55:00",
        photobuktiUrl: "https://example.com/photos/absen3_pengurus1.jpg",
        status: "present",
      },
      {
        id_agenda: agenda3.id_agenda,
        id_pengurus: siti.id_pengurus, // Siti Nurhaliza
        timestamp: "2025-11-28 09:58:00",
        photobuktiUrl: "https://example.com/photos/absen3_pengurus2.jpg",
        status: "present",
      },
      {
        id_agenda: agenda3.id_agenda,
        id_pengurus: budi.id_pengurus, // Budi Santoso
        timestamp: "2025-11-28 10:00:00",
        photobuktiUrl: "https://example.com/photos/absen3_pengurus3.jpg",
        status: "present",
      },
      {
        id_agenda: agenda3.id_agenda,
        id_pengurus: dewi.id_pengurus, // Dewi Sartika
        timestamp: "2025-11-28 10:10:00",
        photobuktiUrl: "https://example.com/photos/absen3_pengurus4.jpg",
        status: "late",
      },
      {
        id_agenda: agenda3.id_agenda,
        id_pengurus: eko.id_pengurus, // Eko Prasetyo
        timestamp: "2025-11-28 10:05:00",
        photobuktiUrl: "https://example.com/photos/absen3_pengurus5.jpg",
        status: "late",
      },
      {
        id_agenda: agenda3.id_agenda,
        id_pengurus: hani.id_pengurus, // Hani Lestari
        timestamp: "2025-11-28 09:50:00",
        photobuktiUrl: "https://example.com/photos/absen3_pengurus8.jpg",
        status: "present",
      },
    ];

    const allAbsenData = [...absenRapat1, ...absenRapat2, ...absenRapat3];

    await AbsenRapat.destroy({ where: {} });

    const createdAbsens = await AbsenRapat.bulkCreate(allAbsenData);

    console.log("✅ Seed Absen Rapat berhasil!");
    console.log(`📝 Total ${createdAbsens.length} data absen dibuat`);
    console.log(`   - Rapat 1: ${absenRapat1.length} absen`);
    console.log(`   - Rapat 2: ${absenRapat2.length} absen`);
    console.log(`   - Rapat 3: ${absenRapat3.length} absen`);
    return createdAbsens;
  } catch (error) {
    console.error("❌ Error seeding Absen Rapat:", error);
    throw error;
  }
};

module.exports = { seedAbsen };
