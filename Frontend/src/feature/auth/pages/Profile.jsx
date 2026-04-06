import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../Componenet/Pageheader";
import ProfileEdit from "./ProfileEdit";
import "../style/profile.scss";

const Profile = () => {
  const { user, loading,handleUpdateProfile,setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  if (loading) return <div className="loader">Loading...</div>;
  if (!user) return <div>Please login first</div>;

  return (
    <div className="profile-page">
      <PageHeader title="Profile" />

      {isEditing ? (
        <ProfileEdit
          user={user}
          setIsEditing={setIsEditing}
          handleUpdateProfile={handleUpdateProfile} 
          setUser={setUser}                         
        />
      ) : (
        <>
          {/* 🔥 PROFILE INFO */}
          <div className="profile-view">
            <div className="profile-pic-section">
              <img
                src={user.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="profile-img"
              />
            </div>

            <div className="profile-info">
              <h2>{user.username}</h2>
              <p>{user.bio || "Web Developer 🚀"}</p>

              <div className="stats">
                <div><b>{user.posts?.length || 0}</b> Posts</div>
                <div><b>{user.followers || 0}</b> Followers</div>
                <div><b>{user.following || 0}</b> Following</div>
              </div>

              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* 🔥 POSTS SECTION */}
          <div className="posts-section">
            {user.posts?.length > 0 ? (
              <div className="posts-grid">
                {user.posts.map((post) => (
                  <div
                    key={post._id}
                    className="post-item"
                    onClick={() => {
                      console.log("CLICKED:", post._id); // 🔥 debug
                      navigate(`/post/${post._id}`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        post.images?.[0] ||
                        "https://via.placeholder.com/300"
                      }
                      alt="post"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-post">No posts yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;