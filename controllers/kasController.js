const { Kas } = require("../models/KasModel");
const { Pengurus } = require("../models/PengurusModel");
const { admin, firebaseInitialized } = require("../config/firebaseConfig");
const path = require("path");

// Helper function untuk mengirim FCM notification
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

// GET /api/kas - Get all kas (dengan optional filter user_id)
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

    // Format response sesuai frontend requirement
    const formattedData = kasList.map((kas) => ({
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

// POST /api/kas - Create new kas
const createKas = async (req, res) => {
  try {
    const { user_id, deskripsi, nominal } = req.body;

    // Validasi input
    if (!user_id || !deskripsi || !nominal) {
      return res.status(400).json({
        success: false,
        message: "User ID, deskripsi, dan nominal wajib diisi",
      });
    }

    // Validasi nominal harus berupa angka
    if (isNaN(nominal) || parseFloat(nominal) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Nominal harus berupa angka yang valid dan lebih dari 0",
      });
    }

    // Cek apakah user exists
    const user = await Pengurus.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Handle file upload
    let buktiTransferUrl = null;
    if (req.file) {
      buktiTransferUrl = req.file.path.replace(/\\/g, "/");
    }

    // Create kas entry
    const newKas = await Kas.create({
      user_id: parseInt(user_id),
      deskripsi: deskripsi,
      nominal: parseFloat(nominal),
      bukti_transfer_url: buktiTransferUrl,
      tanggal: new Date(),
      status: "pending",
    });

    // Format response
    const responseData = {
      id: newKas.id,
      user_id: newKas.user_id,
      deskripsi: newKas.deskripsi,
      nominal: newKas.nominal,
      bukti_transfer_url: buktiTransferUrl
        ? `${req.protocol}://${req.get("host")}/${buktiTransferUrl}`
        : null,
      tanggal: newKas.tanggal,
      status: newKas.status,
    };

    res.status(201).json({
      success: true,
      message: "Data kas berhasil ditambahkan",
      data: responseData,
    });
  } catch (error) {
    console.error("Error creating kas:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menambahkan data kas",
    });
  }
};

// PUT /api/kas/:id - Update kas
const updateKas = async (req, res) => {
  try {
    const { id } = req.params;
    const { deskripsi, nominal, status } = req.body;

    // Cek apakah kas exists
    const kas = await Kas.findByPk(id);
    if (!kas) {
      return res.status(404).json({
        success: false,
        message: "Data kas tidak ditemukan",
      });
    }

    // Prepare update data
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

    // Handle status change
    const oldStatus = kas.status;
    if (status && ["pending", "lunas", "ditolak"].includes(status)) {
      updateData.status = status;
    }

    // Update kas
    await kas.update(updateData);

    // Send FCM notification if status changed
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

    // Format response
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
    };

    res.status(200).json({
      success: true,
      message: "Data kas berhasil diupdate",
      data: responseData,
    });
  } catch (error) {
    console.error("Error updating kas:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengupdate data kas",
    });
  }
};

// DELETE /api/kas/:id - Soft Delete (Reset Status to Pending)
const deleteKas = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah kas exists
    const kas = await Kas.findByPk(id);
    if (!kas) {
      return res.status(404).json({
        success: false,
        message: "Data kas tidak ditemukan",
      });
    }

    // Delete file bukti transfer if exists
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

    // Update: Reset status to pending & remove bukti_transfer_url
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

// GET /api/kas/:id - Get single kas by ID
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

    // Format response
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

// GET /api/kas/total - Get total kas untuk dashboard
const getTotalKas = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    const whereClause = user_id ? { user_id: parseInt(user_id) } : {};

    // Ambil semua data kas dengan status "lunas"
    const kasList = await Kas.findAll({
      where: {
        ...whereClause,
        status: "lunas"
      },
      attributes: ["nominal", "deskripsi"]
    });

    // Hitung total
    const totalKas = kasList.reduce((total, kas) => {
      // Jika deskripsi mengandung kata "pengeluaran" atau "keluar", kurangi
      // Jika deskripsi mengandung kata "pemasukan" atau "masuk", tambah
      const isKeluar = kas.deskripsi.toLowerCase().includes("pengeluaran") || 
                       kas.deskripsi.toLowerCase().includes("keluar");
      
      if (isKeluar) {
        return total - parseFloat(kas.nominal);
      } else {
        return total + parseFloat(kas.nominal);
      }
    }, 0);

    // Hitung jumlah transaksi
    const totalTransaksi = kasList.length;

    // Hitung kas pending (belum dibayar)
    const kasPending = await Kas.count({
      where: {
        ...whereClause,
        status: "pending"
      }
    });

    // Hitung kas ditolak
    const kasDitolak = await Kas.count({
      where: {
        ...whereClause,
        status: "ditolak"
      }
    });

    res.status(200).json({
      success: true,
      message: "Total kas berhasil dihitung",
      data: {
        totalKas: totalKas,
        totalTransaksi: totalTransaksi,
        kasPending: kasPending,
        kasDitolak: kasDitolak,
        kasLunas: kasList.length
      }
    });
  } catch (error) {
    console.error("Error calculating total kas:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghitung total kas"
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
};
