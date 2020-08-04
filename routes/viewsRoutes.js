const express = require('express');
const productController = require('./../controllers/productController');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const blogController = require('./../controllers/blogController');

const router = express.Router();

router.get('/signup', viewsController.getSignupForm);

router.get('/', authController.LoginStatus, viewsController.getOverview);

router.get('/staff', authController.LoginStatus, viewsController.getAllStaff);

router.get('/product/:slug', authController.LoginStatus, viewsController.getProduct);

router.get('/login', authController.LoginStatus, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccountInfo);

router.get('/blogs', authController.LoginStatus, viewsController.getAllBlogs);
router.get('/blog/:slug', authController.LoginStatus, viewsController.getBlog);

router.get(
    '/new-blog', 
    authController.protect,
    authController.restrictTo('admin'),
    viewsController.newBlogForm);

router.get(
    '/delete-blog/:id', 
    authController.protect,
    authController.restrictTo('admin'),
    authController.LoginStatus, 
    blogController.deleteBlog);

router.get('/about', authController.LoginStatus, viewsController.getAboutUs);

router.get('/contact', authController.LoginStatus, viewsController.getContactUs);

router.get('/consultations', authController.protect, viewsController.getConsultationForm);
router.post('/book-consulation', authController.protect, viewsController.bookConsultation);

router.get('/submit-user-data', authController.protect, viewsController.updateUserData);

router.get(
    '/add-new-product',
    authController.protect, 
    authController.restrictTo('admin'), 
    authController.LoginStatus, 
    viewsController.newProductForm);

router.post('/products', authController.LoginStatus, viewsController.addProduct);

router.get(
    '/delete-product/:id', 
    authController.protect, 
    authController.restrictTo('admin'),
    authController.LoginStatus, 
    productController.deleteProduct);


module.exports = router;