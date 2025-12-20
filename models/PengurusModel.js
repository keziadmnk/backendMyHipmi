const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

const Pengurus = sequelize.define(
  "Pengurus",
  {
    id_pengurus: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_bidang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bidang",
        key: "id_bidang",
      },
     
},
 id_jadwal_piket: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: "jadwal_piket",
    key: "id_jadwal_piket",
  },

},
    nama_pengurus: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email_pengurus: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    profil_foto: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    nomor_hp: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    alamat: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fcm_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "pengurus",
    timestamps: false,
    hooks: {
      // Hook untuk enkripsi password sebelum disimpan
      beforeCreate: async (pengurus, options) => {
        if (pengurus.password) {
          const salt = await bcrypt.genSalt(10);
          pengurus.password = await bcrypt.hash(pengurus.password, salt);
        }
      },
      beforeUpdate: async (pengurus, options) => {
        if (pengurus.password) {
          const salt = await bcrypt.genSalt(10);
          pengurus.password = await bcrypt.hash(pengurus.password, salt);
        }
      },
    },
  }
);

module.exports = { Pengurus };
