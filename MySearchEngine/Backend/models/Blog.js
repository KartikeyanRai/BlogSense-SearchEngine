// backend/models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: String,
  snippet: String,
  url: String,
  domain: String,
  content: String,
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
