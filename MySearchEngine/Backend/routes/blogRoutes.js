// backend/routes/blogRoutes.js

import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// ✅ Search blogs by query
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    const regex = new RegExp(query, 'i'); // case-insensitive search
    const results = await Blog.find({
      $or: [
        { title: regex },
        { snippet: regex },
        { content: regex }
      ]
    }).limit(20);

    res.json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// ✅ Add a blog post (for testing/demo)
router.post('/add', async (req, res) => {
  const { title, snippet, url, domain, content } = req.body;

  if (!title || !url || !domain) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const blog = new Blog({ title, snippet, url, domain, content });
    await blog.save();
    res.status(201).json({ success: true, blog });
  } catch (err) {
    console.error('Add error:', err);
    res.status(500).json({ error: 'Failed to add blog' });
  }
});

// ✅ Get all blogs (optional, for admin/debug)
router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

export default router;
