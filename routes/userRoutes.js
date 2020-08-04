const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protect all routes that follow (users must be logged in!)
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe);
router.patch('/updateMyInfo', 
    userController.uploadUserPhoto, 
    userController.resizeImage,
    userController.updateMyInfo);
router.delete('/deleteMyAccount', userController.deleteMyAccount);

// Restrict access to administrators for remaining actions
router.use(authController.restrictTo('admin'));

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createNewUser);

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;