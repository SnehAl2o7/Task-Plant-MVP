import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import PostCard from './PostCard';
import api from '../api/axios';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState('');

  // Sentinel div for infinite scroll
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const fetchPosts = useCallback(
    async (pageNum) => {
      if (loading || !hasMore) return;
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/posts?page=${pageNum}&limit=10`);
        setPosts((prev) =>
          pageNum === 1 ? data.posts : [...prev, ...data.posts]
        );
        setHasMore(data.hasMore);
        setPage(pageNum);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [loading, hasMore]
  );

  // Load first page on mount
  useEffect(() => {
    fetchPosts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load next page when sentinel comes into view
  useEffect(() => {
    if (inView && !loading && hasMore && !initialLoad) {
      fetchPosts(page + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (initialLoad) {
    return <div className="spinner" role="status" aria-label="Loading posts" />;
  }

  if (error && posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⚠️</div>
        <p>{error}</p>
      </div>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🌱</div>
        <p>No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <section className="feed-layout" aria-label="Social feed">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDelete={handleDelete} />
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="load-more-sentinel" aria-hidden="true">
        {loading && <div className="spinner" style={{ margin: '0.5rem auto', width: 24, height: 24, borderWidth: 2 }} />}
        {!hasMore && posts.length > 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '1rem' }}>You've reached the end 🎉</p>
        )}
      </div>
    </section>
  );
}
