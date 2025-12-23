// Migration Script: Change foto_bukti column type from VARCHAR(255) to LONGTEXT
// This fixes the issue where base64 encoded images were being truncated

const mysql = require("mysql2/promise");
const dbConfig = require("../config/db");

async function migrateFotoBukti() {
    // Get connection config from sequelize config
    const config = dbConfig.config;

    const connection = await mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database,
    });

    try {
        console.log("Starting migration: Change foto_bukti to LONGTEXT...");

        // Alter table to change foto_bukti column type
        await connection.query(
            `ALTER TABLE absen_piket MODIFY COLUMN foto_bukti LONGTEXT NOT NULL`
        );

        console.log("✓ Migration completed successfully!");
        console.log("✓ foto_bukti column changed from VARCHAR(255) to LONGTEXT");
        console.log("\nNow base64 images will be stored completely without truncation.");
    } catch (error) {
        console.error("✗ Migration failed:", error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

// Run migration
migrateFotoBukti()
    .then(() => {
        console.log("\nMigration process completed.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\nMigration process failed:", error);
        process.exit(1);
    });
