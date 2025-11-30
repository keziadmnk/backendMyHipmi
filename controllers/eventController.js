const { Event } = require("../models/EventModel");
const { Pengurus } = require("../models/PengurusModel");

const createEvent = async (req, res) => {
  // Ambil data dari body request
  const { 
    id_pengurus,
    nama_event, 
    tanggal, 
    waktu, 
    tempat, 
    dresscode, 
    penyelenggara, 
    contact_person, 
    deskripsi, 
    poster_url 
  } = req.body;

  // Validasi input wajib
  if (!id_pengurus || !nama_event || !tanggal || !waktu || !tempat || !penyelenggara) {
    return res.status(400).json({ message: "ID pengurus, nama event, tanggal, waktu, tempat, dan penyelenggara wajib diisi" });
  }

  try {
    // Simpan data ke database
    const newEvent = await Event.create({
    id_pengurus,
      nama_event,
      tanggal,
      waktu,
      tempat,
      dresscode,
      penyelenggara,
      contact_person,
      deskripsi,
      poster_url,
    });

    return res.status(201).json({ 
      message: "Event berhasil ditambahkan",
      event: newEvent
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server saat membuat event" });
  }
};
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      // Mengambil data relasi dari tabel Pengurus (Creator) 
      include: [
        {
          model: Pengurus,
          as: 'Creator', // Sesuai alias di Relation.js
          attributes: ['id_pengurus', 'nama_pengurus', 'email_pengurus'],
        },
        
      ],
      order: [['tanggal', 'DESC'], ['waktu', 'ASC']], // Mengurutkan dari event terbaru
    });

    // Return empty array jika tidak ada event, bukan error
    return res.status(200).json({
      message: "Daftar event berhasil diambil",
      events: events
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server saat mengambil event" });
  }
};


module.exports = { createEvent, getEvents };