const announcementModel = require("../models/announcementModel");



exports.getAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await announcementModel.findById(id);
        if(!announcement) {
            return res.send({
                error: ''
            })
        } else {
            return res.send({
                announcement,
            })
        }

    } catch (error) {
        console.error(error);
        return res.send({
            message: 'something went wrong',
            error,
        })
    }
}


exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await announcementModel.find({});
        if(!announcements) {
            return res.send({
                error: 'Announcement not found'
            })
        }
        return res.send({
            announcementCount: announcements.length,
            announcements,
        })
    } catch (error) {
        console.error(error);
        return res.send({
            message: 'something went wrong!',
            error,
        })
    }
}


exports.newAnnouncement = async (req, res) => {
    try {
        const { name, priority, audience, subject, content, publish  } = req.body;
        if (!name || !priority || !audience || !subject || !subject) {
            return res.send({
                error: 'missing required Fields'
            })
        }

        const matchingNames = await announcementModel.findOne({ name });
        if(matchingNames) {
            return res.send({
                error: 'there is already an announcement with that name'
            })
        }

        const announcement = await new announcementModel({ name, priority, audience, subject, content, publish });
        await announcement.save();
        return res.send({
            message: 'announcement saved successfully',
            announcement,
        })

    } catch (error) {
        console.error(error);
        return res.send({
            message: 'something went wrong',
            error,
        })
    }
}


exports.updateAnnouncement = async (req, res) => {
    try {
        const {id} = req.params;
        const { name, priority, audience, subject, content, publish} = req.body;
        const announcement = await announcementModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!announcement) {
            return res.send({
                error: 'Announcement not found'
            })
        } else {
            return res.send({
                message: 'Announcement updated successfully',
                announcement,
            })
        }
    } catch (error) {
        console.error(error);
        return res.send({
            message: 'something went wrong',
            error,
        })
    }
}


exports.deleteAnnouncement = async (req, res) => {
    try {
        const {id} = req.params;
        const announcement = await announcementModel.findByIdAndDelete(id);
        if(!announcement) {
            return res.send({
                error: 'Announcement not found'
            })
        } else {
            return res.send({
                message: `Announcement name: ${name} deleted successfully`,
            })
        }
    } catch (error) {
        console.error(error);
        return res.send({
            message: 'something went wrong',
            error,
        })
    }
}


