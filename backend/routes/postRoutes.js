const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  deletePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public
router.get('/', getPosts);

// Protected
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.delete('/:id', protect, deletePost);

module.exports = router;
