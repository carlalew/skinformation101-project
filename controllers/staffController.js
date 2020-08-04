const Staff = require('./../models/staffModel');
const handler = require('./handlerController');

exports.getAllStaff = handler.getAll(Staff);
exports.createNewStaff = handler.createOne(Staff);
