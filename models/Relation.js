const { Bidang } = require("./BidangModel");
const { Pengurus } = require("./PengurusModel");
const { Event } = require("./EventModel");
const AgendaRapat = require("./AgendaRapatModel");
const AbsenRapat = require("./AbsenRapatModel");
const AbsenPiket = require("./AbsenPiketModel");
const { JadwalPiket } = require("./JadwalPiketModel");

Bidang.hasMany(Pengurus, {foreignKey: 'id_bidang'})
Pengurus.belongsTo(Bidang, {foreignKey: 'id_bidang'})
Pengurus.hasMany(Event, {
    foreignKey: 'id_pengurus',
    as: 'CreatedEvents' 
});
Event.belongsTo(Pengurus, { foreignKey: 'id_pengurus',
    as: 'Creator'
});
Pengurus.hasMany(Event, {
    foreignKey: 'id_pengedit',
    as: 'EditedEvents' 
});
Event.belongsTo(Pengurus, {
    foreignKey: 'id_pengedit',
    as: 'Editor'
});

// Relasi AgendaRapat
Pengurus.hasMany(AgendaRapat, {
    foreignKey: 'id_pengurus',
    as: 'Agendas'
});
AgendaRapat.belongsTo(Pengurus, {
    foreignKey: 'id_pengurus',
    as: 'Pengurus'
});

// Relasi AbsenRapat
AgendaRapat.hasMany(AbsenRapat, {
    foreignKey: 'id_agenda',
    as: 'Absensis'
});
AbsenRapat.belongsTo(AgendaRapat, {
    foreignKey: 'id_agenda',
    as: 'Agenda'
});

Pengurus.hasMany(AbsenRapat, {
    foreignKey: 'id_pengurus',
    as: 'Absensis'
});
AbsenRapat.belongsTo(Pengurus, {
    foreignKey: 'id_pengurus',
    as: 'Pengurus'
});

JadwalPiket.hasMany(Pengurus, {
  foreignKey: "id_jadwal_piket",
  as: "PengurusPiket",
});
Pengurus.belongsTo(JadwalPiket, {
  foreignKey: "id_jadwal_piket",
  as: "JadwalPiket",
});

JadwalPiket.hasMany(AbsenPiket, {
  foreignKey: "id_jadwal_piket",
  as: "AbsenPiket",
});
AbsenPiket.belongsTo(JadwalPiket, {
  foreignKey: "id_jadwal_piket",
  as: "Jadwal",
});

Pengurus.hasMany(AbsenPiket, {
  foreignKey: "id_pengurus",
  as: "AbsenPiket",
});
AbsenPiket.belongsTo(Pengurus, {
  foreignKey: "id_pengurus",
  as: "Pengurus",
});