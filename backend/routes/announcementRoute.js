const express = require('express');
const router = express.Router();
const {
    deleteAnnouncement,
    getAnnouncement,
    getAnnouncements,
    newAnnouncement,
    updateAnnouncement,
    togglePublish
} = require('../controllers/announcementController');



router.get('/announcements', getAnnouncements);
router.get('/announcement/:id', getAnnouncement);
router.post('/new', newAnnouncement);
router.delete('/delete/:id', deleteAnnouncement);
router.patch('/update/:id', updateAnnouncement);
router.patch('/toggle-publish/:id', togglePublish);


module.exports = router;