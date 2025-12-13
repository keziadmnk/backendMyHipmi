const { Notification } = require("../models/NotificationModel");

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

module.exports = { getNotifications };
