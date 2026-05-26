import { useState } from "react";
import { useAuth } from "../../auth/hook/useAuth";

import '../style/postcard.scss'

import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal
} from "react-icons/fi";

const PostCard = ({ user, post, handleToggleLike, handleDeletePost }) => {

  const { user: currentUser } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleLikeClick = () => {
    handleToggleLike(post?._id, post?.isLiked);
  };

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  return (
    <div className="post-card">

      <div className="post-header">

        <div className="user-info">
          <img
            className="profile-img"
            src={user?.profileImage || "/default-avatar.png"}
            alt={user?.username}
          />

          <span className="username">
            {user?.username}
          </span>
        </div>

        {/* Sirf owner ko delete button dikhega */}
        {user?._id === currentUser?._id && (
          <button
            className="more-btn"
            type="button"
            onClick={() => setShowModal(true)}
          >
            <FiMoreHorizontal size={20} />
          </button>
        )}

      </div>

      <div className="post-image-wrapper">

        <div className="image-count">
          {currentIndex + 1} / {post?.images?.length}
        </div>

        <div className="post-image-scroll" onScroll={handleScroll}>
          {post?.images?.map((img, i) => (
            <img
              key={`${post?._id}-${i}`}
              src={img}
              alt={`post-${i}`}
            />
          ))}
        </div>

      </div>

      <div className="post-actions">

        <div className="left-actions">

          <button className="icon-btn" onClick={handleLikeClick}>
            <FiHeart className={post?.isLiked ? "icon liked" : "icon"} />
          </button>

          <button className="icon-btn">
            <FiMessageCircle className="icon" />
          </button>

          <button className="icon-btn">
            <FiSend className="icon" />
          </button>

        </div>

        <button className="icon-btn">
          <FiBookmark className="icon" />
        </button>

      </div>

      <div className="post-likes">
        {post?.likesCount || 0} likes
      </div>

      <div className="post-caption">
        <span className="username">{user?.username}</span>

        <span className="caption-text">
          {post?.caption}
        </span>
      </div>

      {
        showModal && (

          <div className="delete-modal-overlay">

            <div
              className="delete-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <h3>Delete Post?</h3>

              <p>
                This action cannot be undone.
              </p>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-btn"
                  onClick={() => {
                    handleDeletePost(post?._id);
                    setShowModal(false);
                  }}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )
      }

    </div>
  );
};

export default PostCard;