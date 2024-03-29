const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Please tell us what you think!']
    },
    rating: {
        type: Number,
        min: 1, 
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Reviews must belong to a product!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Reviews must belong to a user!']
    }
},
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true} 
    } 
);

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'product',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // })

        this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;