const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");



const JadwalPiket = sequelize.define(
  "JadwalPiket",
  {
    id_jadwal_piket: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hari_piket: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "jadwal_piket",
    timestamps: false,
  }
);

module.exports = {JadwalPiket};
