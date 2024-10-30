const mongoose = require('mongoose')
const schema = mongoose.Schema;

const schedulerSchema = new schema({
    employeeId: {
        type: String,
        required: true,
    },
    locationId: {
        type: String,
        required: true,
    },
    positionId: {
        type: String,
        required: true,
    },
    /*area: { // optional: useful if you want to tag FOH/BOH
        type: String,
        enum: ['FOH', 'BOH'],
        default: 'FOH',
    },*/
    shiftDate: {
        type: Date,
        required: true,
    },
    shiftStartTime: {
        type: String,
        required: true,
    },
    shiftEndTime: {
        type: String,
        required: true,
    },
    updatedBy: {
        type: String,
    },
    note: {
        type: String,
    }
}, {timestamps: true});

schedulerSchema.index(
    { employeeId: 1, shiftDate: 1, shiftStartTime: 1 }, { unique: true }
);

const schedulerModel = mongoose.model("scheduler", schedulerSchema);
module.exports = schedulerModel;