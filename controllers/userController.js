const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const fs = require('fs');
const AppError = require('../utils/appError');
const handler = require('./handlerController');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else
    cb(new AppError('Only image files can be uploaded!', 400), false);
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeImage = catchAsync( async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

    next();
});


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMyInfo = catchAsync (async (req, res, next) => {
    // 1. Do not allow user to update password - throw an error
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError("Password cannot be updated from this route! Please use /updateMyPassword", 400))
    }

    // 2. Filter out unwanted field names that should not be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3. Update the user document.
    const userUpdated = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true})

    res.status(200).json({
        status: 'success',
        data: {
            user: userUpdated
        }
    });
});

exports.deleteMyAccount = catchAsync( async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    })
})


exports.createNewUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use signUp instead!'
    });
};

exports.getAllUsers = handler.getAll(User);
exports.getUser = handler.getOne(User);
// CANNOT UPDATE PASSWORDS WITH THIS FUNCTION
exports.updateUser = handler.updateOne(User);
exports.deleteUser = handler.deleteOne(User);