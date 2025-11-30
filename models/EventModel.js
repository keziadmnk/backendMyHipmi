const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Pengurus } = require("./PengurusModel");

const Event = sequelize.define(
  "Event",
  {
    id_event: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pengurus: { // FK ke Pengurus (Pembuat)
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pengurus",
        key: "id_pengurus",
      },
    },
    nama_event: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    waktu: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    tempat: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dresscode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    penyelenggara: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
    id_pengedit: { // FK ke Pengurus (Pengedit terakhir)
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "pengurus",
        key: "id_pengurus",
      },
    },
    poster_url: { 
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  },
  {
    tableName: "event",
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  }
);

module.exports = { Event };