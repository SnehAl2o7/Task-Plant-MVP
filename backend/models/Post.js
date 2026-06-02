const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      maxlength: [300, 'Comment cannot exceed 300 characters'],
      trim: true,
    },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    content: {
      type: String,
      maxlength: [500, 'Post content cannot exceed 500 characters'],
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

// Ensure at least content or image
PostSchema.pre('validate', function (next) {
  if (!this.content && !this.imageUrl) {
    this.invalidate('content', 'Post must have content or an image');
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
