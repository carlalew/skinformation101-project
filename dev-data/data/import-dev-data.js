const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./../../models/productModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
const Blog = require('./../../models/blogModel');
const Staff = require('./../../models/staffModel');
const Blog = require('../../models/blogModel');


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB connection successful!'));

// READ  JSON FILE
const products = JSON.parse (fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
const users = JSON.parse (fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse (fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA TO DB
const importData = async () => {
    try{
        await Product.create(products);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        await Blog.create(blogs);
        await Staff.create(staff);
        console.log('data successfully loaded!');
    } catch(err) {
        console.log(err)
    }
    process.exit();
};

// DELETE CURRENT DATA FROM DB
const deleteData = async () => {
    try{
        await Product.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        await Blog.deleteMany();
        await Staff.deleteMany();
        console.log('data successfully deleted!');
        process.exit();
    } catch(err) {
        console.log(err)
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
