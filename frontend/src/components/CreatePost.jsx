import { useState, useRef } from 'react';
import { Avatar, Button, CircularProgress, Tooltip, IconButton } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const avatarLetter = user?.username?.[0]?.toUpperCase() || '?';

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) {
      setError('Write something or attach an image.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (imageFile) formData.append('image', imageFile);

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setContent('');
      removeImage();
      onPostCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <Avatar
          src={user?.avatar || ''}
          sx={{ width: 42, height: 42, bgcolor: '#7c3aed', fontWeight: 700, border: '2px solid rgba(124,58,237,0.4)' }}
        >
          {avatarLetter}
        </Avatar>

        <textarea
          id="create-post-input"
          className="create-post-textarea"
          placeholder={`What's on your mind, ${user?.username}?`}
          value={content}
          onChange={(e) => { setContent(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          maxLength={500}
          rows={2}
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="preview" />
          <button className="image-preview-remove" onClick={removeImage} title="Remove image">
            <CloseIcon sx={{ fontSize: 14 }} />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</p>
      )}

      {/* Footer */}
      <div className="create-post-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <Tooltip title="Attach image">
            <IconButton
              id="btn-attach-image"
              component="label"
              htmlFor="file-upload"
              size="small"
              sx={{
                color: imageFile ? 'var(--accent-light)' : 'var(--text-muted)',
                '&:hover': { color: 'var(--accent-light)', background: 'rgba(124,58,237,0.1)' },
              }}
            >
              <ImageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {content.length}/500
          </span>
        </div>

        <Button
          id="btn-create-post"
          variant="contained"
          size="small"
          endIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <SendIcon />}
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && !imageFile)}
          sx={{ px: 2 }}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
