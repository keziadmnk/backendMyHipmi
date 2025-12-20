const sequelize = require("../config/db");

const addJadwalPiketColumn = async () => {
  try {
    console.log("🔄 Menambahkan kolom id_jadwal_piket ke tabel pengurus...");

    // Cek apakah kolom sudah ada
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${sequelize.config.database}' 
      AND TABLE_NAME = 'pengurus' 
      AND COLUMN_NAME = 'id_jadwal_piket'
    `);

    if (results.length > 0) {
      console.log("✅ Kolom id_jadwal_piket sudah ada!");
      await sequelize.close();
      process.exit(0);
      return;
    }

    // Tambahkan kolom
    await sequelize.query(`
      ALTER TABLE pengurus 
      ADD COLUMN id_jadwal_piket INT NULL
    `);

    console.log("✅ Kolom id_jadwal_piket berhasil ditambahkan!");

    // Tambahkan foreign key
    await sequelize.query(`
      ALTER TABLE pengurus 
      ADD CONSTRAINT fk_pengurus_jadwal_piket
      FOREIGN KEY (id_jadwal_piket) 
      REFERENCES jadwal_piket(id_jadwal_piket)
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);

    console.log("✅ Foreign key berhasil ditambahkan!");
    console.log("\n✅ Migration selesai!");

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error menambahkan kolom:", error.message);
    await sequelize.close();
    process.exit(1);
  }
};

addJadwalPiketColumn();