const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AbsenRapat = sequelize.define(
  "AbsenRapat",
  {
    id_absenRapat: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_agenda: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "agenda_rapat",
        key: "id_agenda",
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
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    photobuktiUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("present", "late", "invalid"),
      allowNull: false,
      defaultValue: "present",
    },
  },
  {
    tableName: "absen_rapat",
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = AbsenRapat;
