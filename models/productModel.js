const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const productSchema = new mongoose.Schema({
    brand: String,
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        unique: true,
        maxLength: [100, 'A name cannot exceed 50 characters!'],
        minlength: [5, 'A name must have more than 5 characters'],
    },
    slug: String,
    application: String,
    skinType: {
        type: String,
        required: [true, "Please specify who this product is for!"]
    },
    ratingsAverage: {
        type: Number,
        default: 4,
        min: [1, 'rating must be at least 1.0'],
        max: [5, 'a rating cannot be greater than 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'Please describe this product!']
    },
    description: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        default: 'flowers-overview.jpg'
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
},
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true} 
    }
);

//Virtual populate - enables us to connect the product with reviews
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
});

//DOCUMENT MIDDLEWARE - RUNS BEFORE .SAVE() AND .CREATE()
productSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;