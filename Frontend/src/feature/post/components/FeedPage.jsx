import PostCard from "../components/PostCard";
import { usePost } from "../hook/usePost";
import '../style/feed.scss'

const FeedPage = () => {

  const { feed, loading, handleToggleLike } = usePost();

  if (loading) {
    return (
      <div className="feed-loading">
        <p>Loading posts...</p>
      </div>
    );
  }
  return (
    <>

      <main className="feed-page">

        <div className="feed-container">

          {feed?.length === 0 ? (
            <p className="empty-feed">No posts yet</p>
          ) : (
            feed.map((post) => (
              <PostCard
                key={post._id}
                user={post.user}
                post={post}
                handleToggleLike={handleToggleLike}
              />
            ))
          )}

        </div>

      </main>
    </>
  );
};

export default FeedPage;