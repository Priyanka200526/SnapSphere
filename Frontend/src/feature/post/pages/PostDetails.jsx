import "../../post/style/postdetails.scss";
import React, { useEffect, useState, useRef } from "react";
import { usePost } from "../hook/usePost";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";

const Feed = () => {
  const { handleGetFeedPosts, loading } = usePost();
  const [posts, setPosts] = useState([]);
  const sliderRefs = useRef({}); // multiple sliders

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await handleGetFeedPosts();
        setPosts(data.posts || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, []);

  // 🔹 handle horizontal image scroll for each post
  const handleImageScroll = (postId, e) => {
    const slider = sliderRefs.current[postId];
    if (!slider) return;
    const index = Math.round(slider.scrollLeft / slider.clientWidth);
    sliderRefs.current[postId].currentIndex = index;
    setPosts((prev) => [...prev]); // force re-render to update image count
  };

  if (loading) return <h2>Loading...</h2>;
  if (!posts.length) return <h2>No Posts Found</h2>;

  return (
    <div className="insta-post-feed">
      {posts.map((post) => {
        const images = post.images || [];
        const currentIndex = sliderRefs.current[post._id]?.currentIndex || 0;

        return (
          <div className="insta-post" key={post._id}>
            {/* USER HEADER */}
            <div className="post-header">
              <img
                src={post.user?.profileImage || "/default-avatar.png"}
                alt="user"
              />
              <span>{post.user?.username || "User"}</span>
            </div>

            {/* IMAGE SLIDER */}
            <div className="post-image-container">
              <div
                className="image-slider"
                ref={(el) => {
                  if (!sliderRefs.current[post._id]) sliderRefs.current[post._id] = {};
                  sliderRefs.current[post._id].ref = el;
                  sliderRefs.current[post._id].currentIndex =
                    sliderRefs.current[post._id].currentIndex || 0;
                }}
                onScroll={(e) => handleImageScroll(post._id, e)}
              >
                {images.map((img, i) => (
                  <img key={i} src={img} alt="post" />
                ))}
              </div>

              {/* IMAGE COUNT */}
              {images.length > 1 && (
                <div className="image-count">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* ACTION ICONS */}
            <div className="post-actions">
              <div className="left-icons">
                <FaRegHeart color={post.isLiked ? "red" : "black"} />
                <FaRegComment />
                <FiSend />
              </div>
              <BsBookmark />
            </div>

            {/* LIKES */}
            <div className="likes">
              <b>{post.likesCount || 0} Likes</b>
            </div>

            {/* CAPTION */}
            <div className="caption">
              <b>{post.user?.username}</b> {post.caption}
            </div>

            {/* DATE */}
            <div className="date">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;