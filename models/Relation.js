const { Bidang } = require("./BidangModel");
const { Pengurus } = require("./PengurusModel");
const { Event } = require("./EventModel");

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