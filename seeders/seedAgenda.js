const AgendaRapat = require("../models/AgendaRapatModel");
const { Pengurus } = require("../models/PengurusModel");
const sequelize = require("../config/db");

const seedAgenda = async () => {
  try {
    await sequelize.sync();

    const pengurusList = await Pengurus.findAll();
    if (pengurusList.length === 0) {
      throw new Error(
        "Pengurus belum di-seed. Jalankan seedPengurus terlebih dahulu!"
      );
    }

    // Ambil ID pengurus yang sebenarnya dari database
    const ahmad = pengurusList.find(p => p.email_pengurus === "ahmad.fauzi@hipmi.com");
    const siti = pengurusList.find(p => p.email_pengurus === "siti.nurhaliza@hipmi.com");

    if (!ahmad || !siti) {
      throw new Error("Data pengurus tidak lengkap untuk membuat agenda");
    }

    const agendaData = [
      {
        id_pengurus: ahmad.id_pengurus, // Ahmad Fauzi - Ketua Umum
        title: "Rapat Koordinasi Bulanan",
        creatorId: ahmad.id_pengurus,
        creatorName: "Ahmad Fauzi",
        date: "2025-12-10",
        startAt: "2025-12-10 09:00:00",
        endAt: "2025-12-10 11:00:00",
        dateDisplay: "10 Desember 2025",
        startTimeDisplay: "09:00 WIB",
        endTimeDisplay: "11:00 WIB",
        location: "Ruang Meeting Lt.3",
        description:
          "Rapat koordinasi bulanan untuk evaluasi program dan perencanaan kegiatan bulan depan",
        isDone: false,
      },
      {
        id_pengurus: siti.id_pengurus, // Siti Nurhaliza - Sekretaris
        title: "Rapat HIPMI Expo",
        creatorId: siti.id_pengurus,
        creatorName: "Siti Nurhaliza",
        date: "2025-12-15",
        startAt: "2025-12-15 13:00:00",
        endAt: "2025-12-15 16:00:00",
        dateDisplay: "15 Desember 2025",
        startTimeDisplay: "13:00 WIB",
        endTimeDisplay: "16:00 WIB",
        location: "Aula HIPMI",
        description:
          "Pembahasan konsep, budget, dan timeline pelaksanaan HIPMI Expo 2026",
        isDone: false,
      },
      {
        id_pengurus: ahmad.id_pengurus, // Ahmad Fauzi - Ketua Umum
        title: "Evaluasi Kinerja Semester 1",
        creatorId: ahmad.id_pengurus,
        creatorName: "Ahmad Fauzi",
        date: "2025-11-28",
        startAt: "2025-11-28 10:00:00",
        endAt: "2025-11-28 12:00:00",
        dateDisplay: "28 November 2025",
        startTimeDisplay: "10:00 WIB",
        endTimeDisplay: "12:00 WIB",
        location: "Ruang Rapat Utama",
        description:
          "Evaluasi pencapaian target dan kinerja seluruh bidang di semester 1",
        isDone: true,
      },
    ];

    await AgendaRapat.destroy({ where: {} });

    const createdAgendas = await AgendaRapat.bulkCreate(agendaData);

    console.log("✅ Seed Agenda Rapat berhasil!");
    console.log(`📝 Total ${createdAgendas.length} agenda rapat dibuat`);
    return createdAgendas;
  } catch (error) {
    console.error("❌ Error seeding Agenda Rapat:", error);
    throw error;
  }
};

module.exports = { seedAgenda };
