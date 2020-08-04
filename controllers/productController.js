const multer = require('multer');
const sharp = require('sharp');
const Product = require('./../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const handler = require('./handlerController');
// const AppError = require('../utils/appError');

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

exports.uploadProductImages = upload.fields([
    {name: 'coverImage', maxCount: 1},
    {name: 'images', maxCount: 3}
]);

exports.resizeProductImages = catchAsync (async (req, res, next) => {
    if(!req.files.coverImage || !req.files.images) return next();
    
    // 1. Cover Image
    req.body.coverImage = `product-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.coverImage[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.coverImage}`);

    // 2. Loop through other images
    req.body.images = [];
    
    await Promise.all (req.files.images.map(async (file, i) => {
        const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`
        await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

        req.body.images.push(filename);
    })
);
    next();
});

exports.bestValueBits = (req, res, next) => {
    req.query.limit = '3';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields= 'brand,name,price,ratingsAverage,summary'
    next();
};

exports.getAllProducts = handler.getAll(Product);
exports.getProduct = handler.getOne(Product, { path: 'reviews' });
exports.createNewProduct = handler.createOne(Product);
exports.updateProductDetails = handler.updateOne(Product);
exports.deleteProduct = handler.deleteOne(Product);


exports.getProductStats = catchAsync (async (req, res, next) => {
        const stats = await Product.aggregate([
            {
                $match: { ratingsAverage: {$gte: 4.5} }
            },
            {
                $group: {
                    _id: '$skinType', 
                    totalProducts: {$sum: 1},
                    totalRatings: { $sum: '$ratingsQuantity'},
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' }, 
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
});
