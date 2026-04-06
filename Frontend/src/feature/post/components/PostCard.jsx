import { useState } from "react";
import '../style/postcard.scss'
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark,
  FiMoreHorizontal
} from "react-icons/fi";

const PostCard = ({ user, post, handleLike, handleUnLike }) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLikeClick = () => {
    if (post?.isLiked) {
      handleUnLike(post?._id);
    } else {
      handleLike(post?._id);
    }
  };

  // 🔥 scroll tracking
  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  return (
    <div className="post-card">

      {/* Header */}
      <div className="post-header">
        <div className="user-info">
          <img
            className="profile-img"
            src={user?.profileImage || "/default-avatar.png"}
            alt={user?.username}
          />
          <span className="username">{user?.username}</span>
        </div>

        <button className="more-btn">
          <FiMoreHorizontal />
        </button>
      </div>

      {/* 🔥 Image Section */}
      <div className="post-image-wrapper">

        {/* Counter */}
        <div className="image-count">
          {currentIndex + 1} / {post?.images?.length}
        </div>

        {/* Scroll images */}
        <div className="post-image-scroll" onScroll={handleScroll}>
          {post?.images?.map((img, i) => (
            <img key={i} src={img} alt="post" />
          ))}
        </div>

      </div>

      {/* Actions */}
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

      {/* Likes */}
      <div className="post-likes">
        {post?.likesCount || 0} likes
      </div>

      {/* Caption */}
      <div className="post-caption">
        <span className="username">{user?.username}</span>
        <span className="caption-text"> {post?.caption}</span>
      </div>

    </div>
  );
};

export default PostCard;