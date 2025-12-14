const express = require('express');
const router = express.Router();
const { getNotifications } = require('../controllers/notificationController');

// GET semua notifikasi
router.get('/', getNotifications);

module.exports = router;
