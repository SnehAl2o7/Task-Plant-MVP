import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';
import { useState } from 'react';

export default function FeedPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <CreatePost onPostCreated={handlePostCreated} />
        <Feed key={refreshKey} />
      </div>
    </>
  );
}
