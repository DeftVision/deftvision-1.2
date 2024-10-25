const mongoose = require('mongoose');
const schema = mongoose.Schema;

const announcementSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    priority: {
        type: String,
        required: true,
    },
    audience: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    publish: {
        type: Boolean,
        required: false
    }
}, {timestamps: true});

const announcementModel = mongoose.model('Announcement', announcementSchema)
module.exports = announcementModel