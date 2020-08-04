const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes')

const router = express.Router();

// POST  / tour/tourID87365935/reviews
// Redirect requests to URLs as per below to the reviewRouter
router.use('/:productId/reviews', reviewRouter);

router
.route('/best-value-bits')
.get(productController.bestValueBits, productController.getAllProducts);

router
.route('/product-stats')
.get(productController.getProductStats);


router
    .route('/')
    .get(productController.getAllProducts)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        productController.createNewProduct
        );

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(
        authController.protect, 
        authController.restrictTo('admin'), 
        productController.uploadProductImages,
        productController.resizeProductImages,
        productController.updateProductDetails
        )
    .delete(
        authController.protect, 
        authController.restrictTo('admin'), 
        productController.deleteProduct
        );

    
    
module.exports = router;