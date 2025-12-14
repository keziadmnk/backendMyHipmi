const { Notification } = require("../models/NotificationModel");
const { Op } = require("sequelize");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            order: [['created_at', 'DESC']],
        });

        return res.status(200).json({
            message: "Daftar notifikasi berhasil diambil",
            notifications: notifications
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server saat mengambil notifikasi" });
    }
};

const createPiketNotification = async (req, res) => {
    try {
        const { id_pengurus } = req.body;

        if (!id_pengurus) {
            return res.status(400).json({ 
                success: false,
                message: "ID pengurus wajib diisi" 
            });
        }

        // Cek apakah sudah ada notifikasi piket hari ini
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingNotification = await Notification.findOne({
            where: {
                title: "⏰ Piket Hari Ini!",
                body: {
                    [Op.like]: "%Hari Ini Anda Piket!%"
                },
                created_at: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            }
        });

        if (existingNotification) {
            return res.status(200).json({
                success: true,
                message: "Notifikasi piket hari ini sudah ada",
                data: existingNotification
            });
        }

        // Buat notifikasi piket
        const newNotification = await Notification.create({
            title: "⏰ Piket Hari Ini!",
            body: "Hari Ini Anda Piket! Jangan sampai terlewatkan"
        });

        return res.status(201).json({
            success: true,
            message: "Notifikasi piket berhasil dibuat",
            data: newNotification
        });
    } catch (error) {
        console.error("Error creating piket notification:", error);
        return res.status(500).json({ 
            success: false,
            message: "Terjadi kesalahan pada server saat membuat notifikasi piket",
            error: error.message 
        });
    }
};

module.exports = { getNotifications, createPiketNotification };
