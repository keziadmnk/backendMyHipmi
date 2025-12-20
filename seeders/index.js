const { seedBidang } = require("./seedBidang");
const { seedJadwalPiket } = require("./seedJadwalPiket");
const { seedPengurus } = require("./seedPengurus");
const { seedAgenda } = require("./seedAgenda");
const { seedAbsen } = require("./seedAbsen");
const { seedKas } = require("./seedKas");
const sequelize = require("../config/db");

const runSeeders = async () => {
  try {
    console.log("🌱 Memulai proses seeding...\n");

    console.log("📋 Seeding Bidang...");
    await seedBidang();
    console.log("");

    console.log("✅ Seeding Jadwal Piket...");
    await seedJadwalPiket();
    console.log("");

    console.log("👥 Seeding Pengurus...");
    const pengurusList = await seedPengurus();
    console.log("");

    console.log("📅 Seeding Agenda Rapat...");
    await seedAgenda();
    console.log("");

    console.log("✅ Seeding Absen Rapat...");
    await seedAbsen();
    console.log("");

    console.log("💰 Seeding Kas...");
    await seedKas();
    console.log("");

    console.log("✅ Semua seeders berhasil dijalankan!");
    console.log("\n📝 Catatan:");
    console.log("   - Password di file seeder adalah plain text (terbaca)");
    console.log("   - Password di database sudah ter-hash secara otomatis");
    console.log("   - Default password untuk semua pengurus: password123");
    console.log("   - 3 agenda rapat dan data absen berhasil dibuat");
    console.log("   - 11 data kas dengan berbagai status berhasil dibuat");

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error menjalankan seeders:", error);
    await sequelize.close();
    process.exit(1);
  }
};

if (require.main === module) {
  runSeeders();
}

module.exports = { runSeeders };

