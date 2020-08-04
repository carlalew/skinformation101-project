const mongoose = require('mongoose');


const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please tell us your name!"]
    },
    position: {
        type: String,
        required: [true, 'Please state your position']
    },
    focus: {
        type: String
    },
    qualification: {
        type: String
    },
    experience: {
        type: Number
    },
    about: {
        type: String
    },
    photo: {
        type: String,
        default: 'flowers-overview.jpg'
    }
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;