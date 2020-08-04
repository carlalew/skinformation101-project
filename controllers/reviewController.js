const Review = require('./../models/reviewModel');
const handler = require('./handlerController');
// const catchAsync = require('./../utils/catchAsync');

exports.setIds = (req, res, next) => {
       //Allow nested routes 
       if(!req.body.product) req.body.product = req.params.productId;
       if(!req.body.user) req.body.user = req.user.id;
       next();
}

exports.getAllReviews = handler.getAll(Review);
exports.getOneReview = handler.getOne(Review)
exports.createReview = handler.createOne(Review);
exports.updateReview = handler.updateOne(Review);
exports.deleteReview = handler.deleteOne(Review);