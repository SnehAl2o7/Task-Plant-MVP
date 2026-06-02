import { useState } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CommentSection from './CommentSection';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isLiked = user && likes.some(
    (id) => (typeof id === 'object' ? id._id : id)?.toString() === user._id
  );
  const isOwner = user && post.author?._id?.toString() === user._id;
  const avatarLetter = post.author?.username?.[0]?.toUpperCase() || '?';

  const handleLike = async () => {
    if (!user || likeLoading) return;
    // Optimistic update
    setLikes((prev) =>
      isLiked
        ? prev.filter((id) => (typeof id === 'object' ? id._id : id)?.toString() !== user._id)
        : [...prev, { _id: user._id }]
    );
    setLikeLoading(true);
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch {
      // Revert on error
      setLikes(post.likes);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <article className="post-card" aria-label={`Post by ${post.author?.username}`}>
      {/* Header */}
      <div className="post-header">
        <div className="post-avatar-placeholder" aria-hidden="true">
          {avatarLetter}
        </div>
        <div className="post-author">
          <span className="post-username">{post.author?.username || 'Unknown'}</span>
          <span className="post-time">{timeAgo(post.createdAt)}</span>
        </div>
        {isOwner && (
          <Tooltip title="Delete post" placement="left">
            <IconButton
              id={`btn-delete-${post._id}`}
              size="small"
              onClick={handleDelete}
              sx={{
                ml: 'auto',
                color: 'var(--text-muted)',
                '&:hover': { color: 'var(--error)', background: 'rgba(239,68,68,0.08)' },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>

      {/* Content */}
      {post.content && <p className="post-content">{post.content}</p>}
      {post.imageUrl && (
        <img
          className="post-image"
          src={post.imageUrl}
          alt="Post attachment"
          loading="lazy"
        />
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          id={`btn-like-${post._id}`}
          className={`action-btn${isLiked ? ' liked' : ''}`}
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
          disabled={!user}
        >
          {isLiked ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
          <span>{likes.length}</span>
        </button>

        <button
          id={`btn-comment-${post._id}`}
          className="action-btn"
          onClick={() => setShowComments((v) => !v)}
          aria-label="Toggle comments"
          aria-expanded={showComments}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 17 }} />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection postId={post._id} initialComments={post.comments || []} />
      )}
    </article>
  );
}
