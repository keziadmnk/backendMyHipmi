const { Bidang } = require("../models/BidangModel");
const sequelize = require("../config/db");

const seedBidang = async () => {
  try {
    await sequelize.sync();

    const bidangData = [
      {
        nama_bidang: "Ketua Umum",
      },
      {
        nama_bidang: "Sekretaris",
      },
      {
        nama_bidang: "Bendahara",
      },
      {
        nama_bidang: "Bidang Organisasi",
      },
      {
        nama_bidang: "Bidang Kaderisasi",
      },
      {
        nama_bidang: "Bidang Humas",
      },
      {
        nama_bidang: "Bidang Media",
      },
      {
        nama_bidang: "Bidang Pendidikan",
      },
    ];

    await Bidang.destroy({ where: {} });
    await sequelize.query("ALTER TABLE `bidang` AUTO_INCREMENT = 1");

    await Bidang.bulkCreate(bidangData);

    console.log("✅ Seed Bidang berhasil!");
    return bidangData;
  } catch (error) {
    console.error("❌ Error seeding Bidang:", error);
    throw error;
  }
};

module.exports = { seedBidang };
