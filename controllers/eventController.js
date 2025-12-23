const { Event } = require("../models/EventModel");
const { Pengurus } = require("../models/PengurusModel");
const { admin, firebaseInitialized } = require("../config/firebaseConfig");
const { Notification } = require("../models/NotificationModel");

const createEvent = async (req, res) => {
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

    try {
      const dateObj = new Date(tanggal);
      const bulanNama = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const tanggalFormatted = `${dateObj.getDate()} ${bulanNama[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

      const notificationTitle = "📢 Event Baru!";
      const notificationBody = `${nama_event} - ${tanggalFormatted} di ${tempat}`;

      await Notification.create({
        title: notificationTitle,
        body: notificationBody,
      });

      if (firebaseInitialized) {
        const message = {
          notification: {
            title: notificationTitle,
            body: notificationBody,
          },
          data: {
            title: notificationTitle,
            body: notificationBody,
            type: "event", 
          },
          topic: "events", 
        };

        await admin.messaging().send(message);
        console.log("✅ Successfully sent FCM notification for event:", nama_event);
      } else {
        console.log("⚠️  Notification saved to DB but NOT sent via FCM (Firebase not configured)");
      }
    } catch (notifError) {
      console.error("Error sending notification:", notifError);
    }

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
      include: [
        {
          model: Pengurus,
          as: 'Creator',
          attributes: ['id_pengurus', 'nama_pengurus', 'email_pengurus'],
        },

      ],
      order: [['tanggal', 'DESC'], ['waktu', 'ASC']], 
    });
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

const getEventById = async (req, res) => {
  const { id } = req.params; 

  try {
    const event = await Event.findOne({
      where: { id_event: id },
      include: [
        {
          model: Pengurus,
          as: 'Creator',
          attributes: ['id_pengurus', 'nama_pengurus', 'email_pengurus'],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Detail event berhasil diambil",
      event: event 
    });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server saat mengambil detail event" });
  }
};
const updateEvent = async (req, res) => {
  const { id } = req.params;
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

  const updatePayload = {
    id_pengedit: id_pengurus, 
    tanggal,
    waktu,
    tempat,
    dresscode,
    penyelenggara,
    contact_person,
    deskripsi,
  };

  try {
    let eventToUpdate = await Event.findByPk(id);

    if (!eventToUpdate) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    if (req.file) {
      const posterUrl = `${req.protocol}://${req.get("host")}/uploads/events/${req.file.filename}`;
      updatePayload.poster_url = posterUrl;
    }
    Object.keys(updatePayload).forEach(key =>
      (updatePayload[key] === undefined || updatePayload[key] === null) && delete updatePayload[key]
    );


    const [updatedRows] = await Event.update(updatePayload, {
      where: { id_event: id }
    });

    const updatedEvent = await Event.findByPk(id);
    return res.status(200).json({
      message: updatedRows > 0 ? "Event berhasil diupdate" : "Event berhasil diupdate (tidak ada perubahan data)",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server saat mengupdate event" });
  }
};


module.exports = { createEvent, getEvents, deleteEvent, getEventById, updateEvent };