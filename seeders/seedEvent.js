const { Event } = require("../models/EventModel");
const { Pengurus } = require("../models/PengurusModel");
const sequelize = require("../config/db");

const seedEvent = async () => {
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
            throw new Error("Data pengurus tidak lengkap untuk membuat event");
        }

        const events = [
            {
                id_pengurus: ahmad.id_pengurus,
                nama_event: "Seminar Technopreneurship",
                tanggal: "2025-01-15",
                waktu: "09:00:00",
                tempat: "Auditorium Fakultas Ekonomi Universitas Andalas",
                dresscode: "Formal (Kemeja & Celana Bahan)",
                penyelenggara: "HIPMI PT UNAND",
                contact_person: "Rizky - 081234567890",
                deskripsi: "Seminar Technopreneurship bertujuan untuk memberikan wawasan kepada mahasiswa tentang bagaimana membangun bisnis berbasis teknologi di era digital. Narasumber: CEO Startup ternama Indonesia.",
                poster_url: "http://192.168.100.22:3000/uploads/events/techno.jpg",
                id_pengedit: null
            },
            {
                id_pengurus: siti.id_pengurus,
                nama_event: "Family Gathering HIPMI 2025",
                tanggal: "2025-02-20",
                waktu: "08:00:00",
                tempat: "Pantai Padang, Sumatera Barat",
                dresscode: "Casual (Kaos & Jeans)",
                penyelenggara: "HIPMI PT UNAND",
                contact_person: "Dinda - 082345678901",
                deskripsi: "Family Gathering HIPMI PT UNAND 2025 adalah acara kekeluargaan tahunan yang bertujuan untuk mempererat silaturahmi antar anggota HIPMI dan keluarga. Berbagai games dan doorprize menarik menanti!",
                poster_url: "http://192.168.100.22:3000/uploads/events/family gathering.jpeg",
                id_pengedit: null
            }
        ];

        // Hapus data event yang sudah ada
        await Event.destroy({ where: {} });

        const createdEvents = await Event.bulkCreate(events);

        console.log("✅ Seed Event berhasil!");
        console.log(`📝 Total ${createdEvents.length} event dibuat`);
        console.log("   - Seminar Technopreneurship (Ahmad Fauzi)");
        console.log("   - FAMILY GATHERING HIPMI PT UNAND 2025 (Siti Nurhaliza)");

        return createdEvents;
    } catch (error) {
        console.error("❌ Error seeding event:", error);
        throw error;
    }
};

module.exports = { seedEvent };
