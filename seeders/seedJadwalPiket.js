const {JadwalPiket} = require("../models/JadwalPiketModel");
const sequelize = require("../config/db");

const seedJadwalPiket = async () => {
  try {
    await sequelize.sync();

    const jadwalPiketData = [
      {
        hari_piket: "Senin",
      },
      {
        hari_piket: "Selasa",
      },
      {
        hari_piket : "Rabu",
      },
      {
        hari_piket: "Kamis",
      },
      {
        hari_piket: "Jumat",
      },
    ];

    await JadwalPiket.destroy({ where: {} });
    await sequelize.query("ALTER TABLE `jadwal_piket` AUTO_INCREMENT = 1");

    await JadwalPiket.bulkCreate(jadwalPiketData);

    console.log("✅ Seed Jadwal Piket berhasil!");
    return jadwalPiketData;
  } catch (error) {
    console.error("❌ Error seeding Jadwal Piket:", error);
    throw error;
  }
};

module.exports = { seedJadwalPiket };
    
