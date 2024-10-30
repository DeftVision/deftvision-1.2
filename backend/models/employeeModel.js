const mongoose = require('mongoose')
const schema = mongoose.Schema;


const employeeSchema = new schema({
    employeeId: {
        type: String,
        required: false,
        unique: true
    },
   name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: false,
    }
}, {timestamps: true});


const employeeModel = mongoose.model("employee", employeeSchema);
module.exports = employeeModel;
