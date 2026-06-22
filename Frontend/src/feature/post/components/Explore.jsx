import { useEffect, useState } from "react";
import { usePost } from "../hook/usePost";
import { useComment } from "../../comments/hook/useComments";
import "../style/explore.scss";

const Explore = () => {
  const { exploreFeed, handleGetExploreFeed } = usePost();
  const { handleGetCommentCount } = useComment();

  const [isLoading, setIsLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const loadExplore = async () => {
      setIsLoading(true);
      await handleGetExploreFeed();
      setIsLoading(false);
    };

    loadExplore();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {};

      for (const post of exploreFeed) {
        counts[post._id] = await handleGetCommentCount(post._id);
      }

      setCommentCounts(counts);
    };

    if (exploreFeed.length > 0) {
      fetchCounts();
    }
  }, [exploreFeed]);

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h2>Explore</h2>
        <p>Discover people, trends and inspiration</p>
      </div>

      {isLoading ? (
        <div className="explore-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="explore-skeleton" />
          ))}
        </div>
      ) : (
        <div className="explore-grid">
          {exploreFeed.map((post) => (
            <div
              key={post._id}
              className="explore-card"
              onClick={() => setSelectedPost(post)}
            >
              <img src={post.images?.[0]} alt="" />

              <div className="explore-card-overlay">
                <span>View Post</span>
              </div>

              <div className="explore-card-footer">
                <img
                  src={
                    post.user?.profileImage ||
                    "https://via.placeholder.com/40"
                  }
                  alt=""
                />

                <span>{post.user?.username}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    {selectedPost && (
  <div
    className="explore-modal-overlay"
    onClick={() => setSelectedPost(null)}
  >
    <div
      className="explore-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="close-btn"
        onClick={() => setSelectedPost(null)}
      >
        ×
      </button>

      <div className="explore-viewer">
        <div className="explore-viewer-header">
          <div className="creator">
            <img
              src={selectedPost.user?.profileImage}
              alt=""
            />
            <span>{selectedPost.user?.username}</span>
          </div>
        </div>

        <div className="explore-viewer-image">
          <img
            src={selectedPost.images?.[0]}
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Explore;