const { Bidang } = require("./BidangModel");
const { Pengurus } = require("./PengurusModel");

Bidang.hasMany(Pengurus, {foreignKey: 'id_bidang'})
Pengurus.belongsTo(Bidang, {foreignKey: 'id_bidang'})