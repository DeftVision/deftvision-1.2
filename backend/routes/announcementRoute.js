const express = require('express');
const router = express.Router();
const { deleteAnnouncement, getAnnouncement, getAnnouncements, newAnnouncement, updateAnnouncement } = require('../controllers/announcementController');



router.get('/announcements', getAnnouncements);
router.get('/announcement/:id', getAnnouncement);
router.post('/new', newAnnouncement);
router.delete('/delete/:id', deleteAnnouncement);
router.patch('/update/:id', updateAnnouncement);


module.exports = router;