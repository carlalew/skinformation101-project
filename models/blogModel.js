const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'please tell us the title!']
    },
    slug: String,
    dateEntered: {
        type: Date,
        default: Date.now
    },
    summary: {
        type: String,
        required: [true, 'What is this blog about?']
    },
    blogContent: {
        type: String,
        required: [true, 'Oops! Your blog is empty! Please fill in your post!']
    },
    coverImage: {
        type: String,
        default: 'flowers-overview.jpg'
    }
});

blogSchema.pre('save', function(next){
    this.slug = slugify(this.title, {lower: true});
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;