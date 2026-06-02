const Post = require('../models/Post');

const PAGE_SIZE = 10;

// GET /api/posts?page=1&limit=10
const getPosts = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, parseInt(req.query.limit) || PAGE_SIZE);
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar')
      .lean(),
    Post.countDocuments(),
  ]);

  res.json({
    posts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    hasMore: skip + posts.length < total,
  });
};

// POST /api/posts
const createPost = async (req, res) => {
  const { content } = req.body;
  const imageUrl = req.file?.path || '';

  if (!content?.trim() && !imageUrl) {
    return res.status(400).json({ message: 'Post must have content or an image' });
  }

  const post = await Post.create({
    author: req.user._id,
    content: content?.trim() || '',
    imageUrl,
  });

  await post.populate('author', 'username avatar');
  res.status(201).json(post);
};

// PUT /api/posts/:id/like  (toggle like)
const toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const userId = req.user._id.toString();
  const idx = post.likes.findIndex((id) => id.toString() === userId);

  if (idx === -1) {
    post.likes.push(req.user._id);
  } else {
    post.likes.splice(idx, 1);
  }

  await post.save();
  res.json({ likes: post.likes, likeCount: post.likes.length });
};

// POST /api/posts/:id/comments
const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = { user: req.user._id, text: text.trim() };
  post.comments.push(comment);
  await post.save();

  // Re-populate to return the new comment with user info
  await post.populate('comments.user', 'username avatar');
  const newComment = post.comments[post.comments.length - 1];

  res.status(201).json(newComment);
};

// DELETE /api/posts/:id
const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this post' });
  }

  await post.deleteOne();
  res.json({ message: 'Post deleted successfully' });
};

module.exports = { getPosts, createPost, toggleLike, addComment, deletePost };
