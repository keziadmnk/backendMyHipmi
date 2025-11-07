const { seedBidang } = require("./seedBidang");
const { seedPengurus } = require("./seedPengurus");
const { Pengurus } = require("../models/PengurusModel");
const sequelize = require("../config/db");

const runSeeders = async () => {
  try {
    console.log("🌱 Memulai proses seeding...\n");

    console.log("🗑️  Menghapus data lama Pengurus...");
    await Pengurus.destroy({ where: {} });
    console.log("✅ Data Pengurus lama berhasil dihapus\n");

    console.log("📋 Seeding Bidang...");
    await seedBidang();
    console.log("");

    console.log("👥 Seeding Pengurus...");
    await seedPengurus();
    console.log("");

    console.log("✅ Semua seeders berhasil dijalankan!");
    console.log("\n📝 Catatan:");
    console.log("   - Password di file seeder adalah plain text (terbaca)");
    console.log("   - Password di database sudah ter-hash secara otomatis");
    console.log("   - Default password untuk semua pengurus: password123");

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

