const mongoose = require('mongoose');
const evaluationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    foodScore: {
        type: Number,
        required: true,
    },
    cleanScore: {
        type: Number,
        required: true,
    },
    serviceScore: {
        type: Number,
        required: true,
    },
    finalScore: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    },
    location: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
        required: true,
    },
    cashier: {
        type: String,
        required: true,
    },
    upsell: {
        type: Boolean,
        required: false,
    },
    greeting: {
        type: Boolean,
        required: false,
    },
    repeatOrder: {
        type: Boolean,
        required: false,
    },
    idManager: {
        type: Boolean,
        required: false,
    },
    waitTime: {
        type: Number,
        required: true,
    },
    downloadUrl: {
        type: String,
        required: true,
    },
    uniqueFileName: {
        type: String,
        required: true,
    },
}, {timestamps: true});

const evaluationModel = mongoose.model("Evaluation", evaluationSchema)
module.exports = evaluationModel;