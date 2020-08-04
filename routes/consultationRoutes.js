const express = require('express');
const consultationController = require('./../controllers/consultationController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/book-consulation')
    .post (authController.protect, consultationController.bookConsultation);

module.exports = router;
