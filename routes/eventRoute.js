const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middlewares/uploadEvent');
const { createEvent, getEvents, deleteEvent, getEventById, updateEvent  } = require('../controllers/eventController');
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File terlalu besar. Maksimal 5MB' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};


router.post('/', upload.single('poster'), handleMulterError, createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.delete('/:id', deleteEvent);
router.put('/:id', upload.single('poster'), handleMulterError, updateEvent);

module.exports = router;