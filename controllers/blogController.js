const Blog = require('./../models/blogModel');
const handler = require('./handlerController');
// const catchAsync = require('./../utils/catchAsync');

exports.getAllBlogs = handler.getAll(Blog);
exports.getBlog = handler.getOne(Blog);
exports.createNewBlog = handler.createOne(Blog);
exports.updateBlog = handler.updateOne(Blog);
exports.deleteBlog = handler.deleteOne(Blog);
