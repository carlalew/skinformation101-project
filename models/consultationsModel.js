const mongoose = require('mongoose');
const validator = require('validator');

const consultationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        minlength: 5
    },
    email: {
        type: String,
        required: [true, 'email is required!'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    phone: {
        type: Number,
        required: [true, 'please provide your phone number!']
    },
    skinConcern: {
        type: String,
        required: [true, 'We need to understand your concern! Please tell us about it.']
    },
    currentRoutine: String
});

const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;