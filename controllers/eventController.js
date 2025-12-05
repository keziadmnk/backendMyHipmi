const { Event } = require("../models/EventModel");
const { Pengurus } = require("../models/PengurusModel");

const createEvent = async (req, res) => {
  // Ambil data dari body request (multipart form data)
  const { 
    id_pengurus,
    nama_event, 
    tanggal, 
    waktu, 
    tempat, 
    dresscode, 
    penyelenggara, 
    contact_person, 
    deskripsi
  } = req.body;

  // Validasi input wajib
  if (!id_pengurus || !nama_event || !tanggal || !waktu || !tempat || !penyelenggara) {
    return res.status(400).json({ message: "ID pengurus, nama event, tanggal, waktu, tempat, dan penyelenggara wajib diisi" });
  }

  try {
    let posterUrl = null;
    
   
    console.log("=== CREATE EVENT DEBUG ===");
    console.log("Content-Type:", req.get("content-type"));
    console.log("File received:", req.file ? req.file.filename : "No file");
    if (req.file) {
      console.log("File details:", {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename
      });
    }
    console.log("Request body:", req.body);
    console.log("==========================");
    
    if (req.file) {
      posterUrl = `${req.protocol}://${req.get("host")}/uploads/events/${req.file.filename}`;
      console.log("✅ Poster URL generated:", posterUrl);
    } else {
      console.log("❌ No file uploaded - req.file is null");
    }
    
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
      poster_url: posterUrl,
    });
    
    console.log("Event created successfully with poster_url:", newEvent.poster_url);

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
          as: 'Creator', 
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

const deleteEvent = async (req, res) => {
    const { id } = req.params; 

    try {
        // Cari dan hapus event
        const deletedRows = await Event.destroy({
            where: { id_event: id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Event tidak ditemukan" });
        }


        return res.status(200).json({ message: "Event berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server saat menghapus event" });
    }
};

module.exports = { createEvent, getEvents, deleteEvent };