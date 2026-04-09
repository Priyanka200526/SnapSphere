import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePost } from "../hook/usePost";
import "../style/postdetails.scss";

const PostDetails = () => {
  const { postid } = useParams();
  const { handleGetPostDetails, loading } = usePost();

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await handleGetPostDetails(postid);

        // 🔥 IMPORTANT
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [postid]);

  if (loading) return <h2>Loading...</h2>;
  if (!post) return <h2>No Post Found</h2>;

  return (
    <div className="post-details">

      {/* USER */}
      <div className="post-header">
        <img
          src={post.user?.profileImage}
          alt="user"
          width="40"
        />
        <h3>{post.user?.username}</h3>
      </div>

      {/* IMAGE */}
      <div className="post-image">
        <img src={post.images?.[0]} alt="post" />
      </div>

      {/* CAPTION */}
      <div className="caption">
        <b>{post.user?.username}</b> {post.caption}
      </div>

      {/* LIKES */}
      <div className="likes">
        {post.likesCount || 0} Likes
      </div>

      {/* DATE */}
      <div className="date">
        {new Date(post.createdAt).toLocaleDateString()}
      </div>

    </div>
  );
};

export default PostDetails;