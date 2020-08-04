const express = require('express');
const blogController = require('./../controllers/blogController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
.route('/')
.get(blogController.getAllBlogs)
.post(
    authController.protect,
    authController.restrictTo('admin'),
    blogController.createNewBlog
    );

router.route('/:id')
.get(blogController.getBlog)
.patch(blogController.updateBlog)
.delete(blogController.deleteBlog);

module.exports = router;