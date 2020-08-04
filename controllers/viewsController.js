const Product = require('./../models/productModel');
const User = require('./../models/userModel');
const Blog = require('./../models/blogModel')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Consultation = require('../models/consultationsModel');
const Staff = require('./../models/staffModel');

exports.getOverview = catchAsync( async (req, res, next) => {
    // 1. Get Product Data
    const products = await Product.find();


    // 2. Render template using the product data from step 1
    res.status(200).render('overview', {
        title: 'All Products', 
        products
    });
});

exports.getAllStaff = catchAsync( async (req, res, next) => {
    // 1. Get staff Data
    const staffs = await Staff.find();

    // 2. Render template using the staff data from step 1
    res.status(200).render('staff', {
        title: 'All Staff', 
        staffs
    });
});


exports.getProduct = catchAsync( async (req, res, next) => {
    const product = await Product.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!product) {
        return next(new AppError('There is no product with that name!', 404));
    }
    
    res.status(200).render('product', {
        title: 'Skingredients Skin Veg',
        product
    });
});

exports.getAllBlogs = catchAsync( async (req, res, next) => {
    const blogs = await Blog.find();

    res.status(200).render('blogs', {
        title: 'All Blogs',
        blogs
    });
});

exports.getBlog = catchAsync( async (req, res, next) => {
    const blog = await Blog.findOne({slug: req.params.slug});

    res.status(200).render('blog', {
        title: 'Blog',
        blog
    });
});

exports.newBlogForm = (req, res) => {
    res.status(200).render('new-blog', {
        title: 'Add New Blog'
    });
};

exports.addBlog = catchAsync (async (req, res, next) => {
    const blog = await Blog.create({
            title: req.body.title,
            summary: req.body.summary,
            blogContent: req.body.blogContent,
            coverImage: req.body.coverImage
    });
    res.status(200).json({
        status: 'success',
        message: 'New Blog Added Succesfully',
        blog
    });
});

exports.deleteBlog = catchAsync (async (req, res, next) => {
    const blog = await Blog.findByIdAndDelete(req.params.id)

     res.status(204).json({
        status: 'success',
        data: null
     });

     window.setTimeout(() => {
        location.assign('/blogs');
    }, 1000);;
 });


exports.getConsultationForm = (req, res) => {
    res.status(200).render('consultations', {
        title: 'consultations'
    });
};

exports.bookConsultation = catchAsync (async (req, res, next) => {
    const consultation = await Consultation.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            skinConcern: req.body.skinConcern,
            currentRoutine: req.body.currentRoutine
    });

    res.status(200).json({
        status: 'success',
        message: 'Consultation Booked Successfully!',
        consultation
    });
});

exports.newProductForm = (req, res) => {
    res.status(200).render('add-new', {
        title: 'add-new'
    });
};

exports.addProduct = catchAsync (async (req, res, next) => {
    const product = await Product.create({
            brand: req.body.brand,
            name: req.body.name,
            skinType: req.body.skinType,
            price: req.body.price,
            summary: req.body.summary,
            description: req.body.description,
            coverImage: req.body.coverImage
    });
    res.status(200).json({
        status: 'success',
        message: 'Product Added Successfully!',
        product
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Login'
    });
};

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign Up'
    });
};

exports.getAccountInfo = (req, res) => {
    res.status(200).render('account', {
        title: 'My Account'
    });
}


exports.getAboutUs = (req, res) => {
    res.status(200).render('aboutUs', {
        title: 'About Us'
    });
};

exports.getContactUs = (req, res) => {
    res.status(200).render('contactUs', {
        title: 'Contact Us'
    });
};

exports.updateUserData = catchAsync (async (req, res, next) => {
    const userUpdated = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, 
    {
        new: true,
        runValidators: true
    });
    res.status(200).render('account', {
        title: 'My Account',
        user: userUpdated
    });
})