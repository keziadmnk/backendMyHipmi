const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Bidang = sequelize.define(
  "Bidang",
  {
    id_bidang: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_bidang: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "bidang",
    timestamps: false,
  }
);

module.exports = { Bidang };
