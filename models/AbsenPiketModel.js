const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AbsenPiket = sequelize.define(
  "AbsenPiket",
  {
    id_absen_piket: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_jadwal_piket: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "jadwal_piket",
        key: "id_jadwal_piket",
      },
    },
    id_pengurus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pengurus",
        key: "id_pengurus",
      },
    },
    foto_bukti: {
      type: DataTypes.TEXT('long'), // Changed from STRING(255) to TEXT('long') to store full base64 images
      allowNull: false,
    },
    tanggal_absen: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    jam_mulai: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    jam_selesai: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status_absen: {
      type: DataTypes.ENUM("sudah absen", "belum absen"),
      allowNull: false,
      defaultValue: "sudah absen",
    },
  },
  {
    tableName: "absen_piket",
    timestamps: false,
  }
);

module.exports = AbsenPiket;
