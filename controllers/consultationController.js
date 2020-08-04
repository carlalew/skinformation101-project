const Consultation = require('./../models/consultationsModel');
const catchAsync = require('./../utils/catchAsync');

exports.bookConsultation = catchAsync (async (req, res, next) => {
    const consultation = await Consultation.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            skinConcern: req.body.skinConcern,
            currentRoutine: req.body.currentRoutine
    });

    res.status(200).json({
        status: 'success',
        message: 'Consultation Booked Successfully!',
        consultation
    });
});