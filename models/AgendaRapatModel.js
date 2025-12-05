const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AgendaRapat = sequelize.define(
  "AgendaRapat",
  {
    id_agenda: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pengurus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pengurus",
        key: "id_pengurus",
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    creatorName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateDisplay: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    startTimeDisplay: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    endTimeDisplay: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "agenda_rapat",
    timestamps: true,
  }
);

module.exports = AgendaRapat;
