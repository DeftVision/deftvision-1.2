const schedulerModel = require('../models/schedulerModel');


exports.newSchedule = async (req, res) => {
    try {
        const {employeeId, locationId, positionId, shiftDate, shiftStartTime, shiftEndTime, updatedBy, note } = req.body;
        if(!employeeId || !locationId || !positionId || !shiftDate || !shiftStartTime || !shiftEndTime || !updatedBy) {
            return res.send({
                error: 'All fields are required',
            })
        }
        const schedule = new schedulerModel({employeeId, locationId, positionId, shiftDate, shiftStartTime, shiftEndTime, updatedBy, note});
        await schedule.save();
        return res.send({
            message: 'Schedule created successfully.',
            schedule,
        })

    } catch (error) {
        console.log(error);
        return res.send({
            error: 'An error occurred while creating a new schedule.'
        })
    }
}

exports.updateSchedule = async (req, res) => {
    try {
        const {id} = req.params;
        const {employeeId, locationId, positionId, shiftDate, shiftStartTime, shiftEndTime, updatedBy, note } = req.body;
        const schedule = await schedulerModel.findByIdAndUpdate(id, req.body, {new: true});
        return res.send({
            message: 'Schedule updated successfully.',
            schedule,
        })

    } catch (error) {
        console.log(error);
        return res.send({
            error: 'An error occurred while updating a schedule'
        })
    }
}

exports.deleteSchedule = async (req, res) => {
    try {
        const {id} = req.params;
        const schedule = await schedulerModel.findByIdAndDelete(id);
        if (!schedule) {
            return res.send({
                error: 'Schedule not found.'
            })
        }
        return res.send({
            message: 'Schedule deleted successfully.',
            schedule,
        })
    } catch (error) {
        console.log(error);
        return res.send({
            error: 'An error occurred while deleting a schedule.'
        })
    }
}

exports.getSchedule = async (req, res) => {
    try {
        const schedule = await schedulerModel.findById(req.params.id);
        if(!schedule) {
            return res.send({
                error: 'Schedule not found.'
            })
        }
        return res.send({
            schedule,
        })

    } catch (error) {
        console.log(error);
        return res.send({
            error: 'An error occurred while getting schedule.'
        })
    }
}

exports.getSchedules = async (req, res) => {
    try {
        const locationId = req.query.locationId;
        const schedules = await schedulerModel.find(locationId ? {locationId} : {});
        if(!schedules) {
            return res.send({
                error: 'No schedules found.'
            })
        }
        return res.send({
            scheduleCount: schedules.length,
            schedules,
        })
            } catch (error) {
        console.log(error);
        return res.send({
            error: 'An error occurred while getting schedules'
        })
    }
}