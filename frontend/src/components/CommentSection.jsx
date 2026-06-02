import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function CommentSection({ postId, initialComments }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data: newComment } = await api.post(`/posts/${postId}/comments`, {
        text: text.trim(),
      });
      setComments((prev) => [...prev, newComment]);
      setText('');
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const avatarLetter = (username) => username?.[0]?.toUpperCase() || '?';

  return (
    <div className="comment-section">
      {comments.map((c) => (
        <div key={c._id} className="comment-item">
          <div className="comment-avatar">{avatarLetter(c.user?.username)}</div>
          <div className="comment-body">
            <span className="comment-username">{c.user?.username || 'Unknown'}</span>
            <span className="comment-text">{c.text}</span>
            <div className="comment-time">{timeAgo(c.createdAt)}</div>
          </div>
        </div>
      ))}

      {user && (
        <div className="comment-input-row">
          <div className="comment-avatar">{avatarLetter(user.username)}</div>
          <input
            id={`comment-input-${postId}`}
            className="comment-input"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={300}
          />
          <button
            className="comment-send-btn"
            onClick={handleSend}
            disabled={loading || !text.trim()}
            aria-label="Send comment"
          >
            <SendIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      )}
    </div>
  );
}
