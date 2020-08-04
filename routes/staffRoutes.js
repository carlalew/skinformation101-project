const express = require('express');
const staffController = require('./../controllers/staffController');

const router = express.Router();

router
.route('/')
.get(staffController.getAllStaff)
.post(staffController.createNewStaff);

module.exports = router;