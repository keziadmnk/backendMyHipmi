const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Kas = sequelize.define(
  "Kas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pengurus",
        key: "id_pengurus",
      },
    },
    deskripsi: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    nominal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    bukti_transfer_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("pending", "lunas", "ditolak"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "kas",
    timestamps: false,
  }
);

module.exports = { Kas };
