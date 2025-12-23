const { Kas } = require("../models/KasModel");
const { Pengurus } = require("../models/PengurusModel");
const { admin, firebaseInitialized } = require("../config/firebaseConfig");
const { Notification } = require("../models/NotificationModel");
const path = require("path");

const sendFCMNotification = async (fcmToken, title, body, data = {}) => {
  if (!firebaseInitialized) {
    console.log("⚠️  Firebase not initialized, skipping notification");
    return null;
  }

  if (!fcmToken) {
    console.log("⚠️  No FCM token provided, skipping notification");
    return null;
  }

  try {
    const message = {
      token: fcmToken,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    };

    const response = await admin.messaging().send(message);
    console.log("✅ FCM notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending FCM notification:", error);
    return null;
  }
};

const getKasList = async (req, res) => {
  try {
    const { user_id } = req.query;

    const whereClause = user_id ? { user_id: parseInt(user_id) } : {};

    const kasList = await Kas.findAll({
      where: whereClause,
      include: [
        {
          model: Pengurus,
          as: "User",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus", "jabatan"],
        },
      ],
      order: [["tanggal", "DESC"]],
    });

    const formattedData = kasList.map((kas) => ({
      id: kas.id,
      user_id: kas.user_id,
      deskripsi: kas.deskripsi,
      nominal: parseFloat(kas.nominal), 
      bukti_transfer_url: kas.bukti_transfer_url
        ? `${req.protocol}://${req.get("host")}/${kas.bukti_transfer_url}`
        : null,
      tanggal: kas.tanggal, 
      status: kas.status.toLowerCase(), 
      user: kas.User ? {
        id_pengurus: kas.User.id_pengurus,
        nama_pengurus: kas.User.nama_pengurus,
        email_pengurus: kas.User.email_pengurus,
        jabatan: kas.User.jabatan,
      } : null,
    }));

    res.status(200).json({
      success: true,
      message: "Data kas berhasil diambil",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching kas list:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data kas",
    });
  }
};

const createKas = async (req, res) => {
  try {
    const { user_id, deskripsi, nominal } = req.body;
    if (!user_id || !deskripsi || !nominal) {
      return res.status(400).json({
        success: false,
        message: "User ID, deskripsi, dan nominal wajib diisi",
      });
    }

    if (isNaN(nominal) || parseFloat(nominal) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Nominal harus berupa angka yang valid dan lebih dari 0",
      });
    }

    const user = await Pengurus.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    let buktiTransferUrl = null;
    if (req.file) {
      buktiTransferUrl = req.file.path.replace(/\\/g, "/");
    }

    const newKas = await Kas.create({
      user_id: parseInt(user_id),
      deskripsi: deskripsi,
      nominal: parseFloat(nominal),
      bukti_transfer_url: buktiTransferUrl,
      tanggal: new Date(),
      status: "pending",
    });

    const responseData = {
      id: newKas.id,
      user_id: newKas.user_id,
      deskripsi: newKas.deskripsi,
      nominal: parseFloat(newKas.nominal),
      status: newKas.status.toLowerCase(),
      bukti_transfer_url: buktiTransferUrl
        ? `${req.protocol}://${req.get("host")}/${buktiTransferUrl}`
        : null,
      created_at: newKas.tanggal,
    };

    res.status(201).json({
      success: true,
      message: "Pembayaran kas berhasil dikirim",
      data: responseData,
    });
  } catch (error) {
    console.error("Error creating kas:", error);
    if (error.message && error.message.includes("File")) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengupload file gambar",
      });
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan data kas",
    });
  }
};
const updateKas = async (req, res) => {
  try {
    const { id } = req.params;
    const { deskripsi, nominal, status } = req.body;
    const kas = await Kas.findByPk(id);
    if (!kas) {
      return res.status(404).json({
        success: false,
        message: "Data kas tidak ditemukan",
      });
    }
    const updateData = {};
    if (deskripsi) updateData.deskripsi = deskripsi;
    if (nominal) {
      if (isNaN(nominal) || parseFloat(nominal) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Nominal harus berupa angka yang valid dan lebih dari 0",
        });
      }
      updateData.nominal = parseFloat(nominal);
    }

    if (req.file) {
      if (kas.bukti_transfer_url) {
        const fs = require("fs");
        const oldFilePath = path.join(__dirname, "..", kas.bukti_transfer_url);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
            console.log(`🗑️  File lama dihapus: ${kas.bukti_transfer_url}`);
          } catch (fileError) {
            console.error("⚠️  Error menghapus file lama:", fileError.message);
          }
        }
      }
      updateData.bukti_transfer_url = req.file.path.replace(/\\/g, "/");
    }

    const oldStatus = kas.status;
    if (status && ["pending", "lunas", "ditolak"].includes(status.toLowerCase())) {
      updateData.status = status.toLowerCase();
    }

    await kas.update(updateData);

    if (status && status !== oldStatus) {
      const user = await Pengurus.findByPk(kas.user_id);
      if (user && user.fcm_token) {
        let notificationTitle = "";
        let notificationBody = "";

        switch (status) {
          case "lunas":
            notificationTitle = "Pembayaran Disetujui ✅";
            notificationBody = `Pembayaran "${kas.deskripsi}" sebesar Rp ${kas.nominal.toLocaleString("id-ID")} telah disetujui`;
            break;
          case "ditolak":
            notificationTitle = "Pembayaran Ditolak ❌";
            notificationBody = `Pembayaran "${kas.deskripsi}" sebesar Rp ${kas.nominal.toLocaleString("id-ID")} ditolak`;
            break;
          case "pending":
            notificationTitle = "Status Pembayaran Berubah";
            notificationBody = `Pembayaran "${kas.deskripsi}" kembali ke status pending`;
            break;
        }

        await sendFCMNotification(
          user.fcm_token,
          notificationTitle,
          notificationBody,
          {
            type: "kas_status_update",
            kas_id: kas.id.toString(),
            status: status,
          }
        );
      }
    }

    const responseData = {
      id: kas.id,
      user_id: kas.user_id,
      deskripsi: kas.deskripsi,
      nominal: parseFloat(kas.nominal),
      bukti_transfer_url: kas.bukti_transfer_url
        ? `${req.protocol}://${req.get("host")}/${kas.bukti_transfer_url}`
        : null,
      tanggal: kas.tanggal,
      status: kas.status.toLowerCase(),
    };

    res.status(200).json({
      success: true,
      message: "Data kas berhasil diupdate",
      data: responseData,
    });
  } catch (error) {
    console.error("Error updating kas:", error);

    if (error.message && error.message.includes("File")) {
      return res.status(400).json({
        success: false,
        message: "Gagal mengupload file gambar",
      });
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate data kas",
    });
  }
};

const deleteKas = async (req, res) => {
  try {
    const { id } = req.params;
    const kas = await Kas.findByPk(id);
    if (!kas) {
      return res.status(404).json({
        success: false,
        message: "Data kas tidak ditemukan",
      });
    }

    if (kas.bukti_transfer_url) {
      const fs = require("fs");
      const filePath = path.join(__dirname, "..", kas.bukti_transfer_url);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`🗑️  File bukti transfer dihapus: ${kas.bukti_transfer_url}`);
        } catch (fileError) {
          console.error("⚠️  Error menghapus file:", fileError.message);
        }
      }
    }

    await kas.update({
      status: "pending",
      bukti_transfer_url: null,
    });

    console.log(`♻️  Kas ID ${id} berhasil di-reset ke pending`);

    res.status(200).json({
      success: true,
      message: "Status pembayaran berhasil di-reset ke pending. Silakan upload bukti transfer baru.",
      data: {
        id: kas.id,
        user_id: kas.user_id,
        deskripsi: kas.deskripsi,
        nominal: kas.nominal,
        bukti_transfer_url: null,
        tanggal: kas.tanggal,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Error resetting kas:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mereset status pembayaran",
    });
  }
};

const getKasById = async (req, res) => {
  try {
    const { id } = req.params;

    const kas = await Kas.findByPk(id, {
      include: [
        {
          model: Pengurus,
          as: "User",
          attributes: ["id_pengurus", "nama_pengurus", "email_pengurus", "jabatan"],
        },
      ],
    });

    if (!kas) {
      return res.status(404).json({
        success: false,
        message: "Data kas tidak ditemukan",
      });
    }

    const responseData = {
      id: kas.id,
      user_id: kas.user_id,
      deskripsi: kas.deskripsi,
      nominal: kas.nominal,
      bukti_transfer_url: kas.bukti_transfer_url
        ? `${req.protocol}://${req.get("host")}/${kas.bukti_transfer_url}`
        : null,
      tanggal: kas.tanggal,
      status: kas.status,
      user: kas.User ? {
        id_pengurus: kas.User.id_pengurus,
        nama_pengurus: kas.User.nama_pengurus,
        email_pengurus: kas.User.email_pengurus,
        jabatan: kas.User.jabatan,
      } : null,
    };

    res.status(200).json({
      success: true,
      message: "Data kas berhasil diambil",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching kas by id:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data kas",
    });
  }
};

const getTotalKas = async (req, res) => {
  try {
    const { user_id } = req.query;

    const whereClause = user_id ? { user_id: parseInt(user_id) } : {};

    const kasList = await Kas.findAll({
      where: {
        ...whereClause,
        status: "lunas"
      },
      attributes: ["nominal"]
    });

    const totalKas = kasList.reduce((total, kas) => {
      return total + parseFloat(kas.nominal);
    }, 0);

    res.status(200).json({
      success: true,
      message: "Total kas berhasil diambil",
      total_kas: totalKas
    });
  } catch (error) {
    console.error("Error calculating total kas:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghitung total kas",
      total_kas: 0
    });
  }
};

const sendKasReminder = async () => {
  try {
    const bulanNama = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const now = new Date();
    const currentMonth = bulanNama[now.getMonth()];
    const currentYear = now.getFullYear();

    const notificationTitle = "💰 Reminder Pembayaran Kas";
    const notificationBody = `Jangan lupa bayar kas bulan ${currentMonth} ${currentYear}! Segera upload bukti transfer.`;

    console.log(`📢 Sending kas reminder for ${currentMonth} ${currentYear}...`);

    const savedNotification = await Notification.create({
      title: notificationTitle,
      body: notificationBody,
    });

    console.log(`✅ Notification saved to database (ID: ${savedNotification.id_notification})`);
    if (firebaseInitialized) {
      const message = {
        data: {
          title: notificationTitle,
          body: notificationBody,
          type: "kas_reminder",
          month: currentMonth,
          year: currentYear.toString(),
        },
        topic: "kas_reminder", 
      };

      const response = await admin.messaging().send(message);
      console.log(`✅ FCM notification sent successfully for ${currentMonth}:`, response);

      return {
        success: true,
        message: `Reminder sent for ${currentMonth} ${currentYear}`,
        notificationId: savedNotification.id_notification,
        fcmResponse: response
      };
    } else {
      console.log("⚠️  Notification saved to DB but NOT sent via FCM (Firebase not initialized)");
      return {
        success: false,
        message: "Firebase not initialized",
        notificationId: savedNotification.id_notification
      };
    }
  } catch (error) {
    console.error("❌ Error sending kas reminder:", error);
    throw error;
  }
};

const sendKasReminderManual = async (req, res) => {
  try {
    console.log("🔔 Manual kas reminder triggered by API call");
    const result = await sendKasReminder();

    return res.status(200).json({
      success: true,
      message: "Reminder pembayaran kas berhasil dikirim",
      data: result
    });
  } catch (error) {
    console.error("Error sending manual kas reminder:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengirim reminder pembayaran kas",
      error: error.message
    });
  }
};

module.exports = {
  getKasList,
  createKas,
  updateKas,
  deleteKas,
  getKasById,
  getTotalKas,
  sendKasReminder,      
  sendKasReminderManual,  
};
