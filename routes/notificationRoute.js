const express = require('express');
const router = express.Router();
const { getNotifications, createPiketNotification } = require('../controllers/notificationController');

router.get('/', getNotifications);
router.post('/piket', createPiketNotification);

module.exports = router;
