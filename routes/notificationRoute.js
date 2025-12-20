const express = require('express');
const router = express.Router();
const { getNotifications, createPiketNotification } = require('../controllers/notificationController');

// GET semua notifikasi
router.get('/', getNotifications);

// POST notifikasi piket
router.post('/piket', createPiketNotification);

module.exports = router;
