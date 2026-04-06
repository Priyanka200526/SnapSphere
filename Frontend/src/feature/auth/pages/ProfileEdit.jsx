import React, { useState } from "react";
import toast from "react-hot-toast";
import "../style/ProfileEdit.scss";

const ProfileEdit = ({ user, setIsEditing, handleUpdateProfile, setUser }) => {

  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    profilePicFile: null,
  });

  const [preview, setPreview] = useState(user?.profileImage || "");

  if (!user) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicFile: file });
      setPreview(URL.createObjectURL(file)); // 🔥 live preview
    }
  };

  const handleSave = async () => {
    try {
      const dataToSend = new FormData();
      dataToSend.append("username", formData.username);
      dataToSend.append("bio", formData.bio);
      if (formData.profilePicFile) {
        dataToSend.append("profileImage", formData.profilePicFile);
      }

      const data = await handleUpdateProfile(dataToSend);
      setUser(data.user);
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch {
      toast.error("Update failed!");
    }
  };

  return (
    <div className="profile-edit">
  <h3>Edit Profile</h3>

  <div className="image-section">
    <div className="img-container">
      <img src={preview || "https://via.placeholder.com/150"} alt="preview" />
    </div>
    <label className="upload-btn">
      Change Photo
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </label>
  </div>

  <div className="form-group">
    <label>Full Name</label>
    <input
      type="text"
      placeholder="Enter your name"
      value={formData.username}
      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
    />
  </div>

  <div className="form-group">
    <label>Short Bio</label>
    <textarea
      placeholder="Tell the world about you..."
      value={formData.bio}
      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
    />
  </div>

  <div className="buttons">
    <button className="cancel-btn" onClick={() => setIsEditing(false)}>
      Cancel
    </button>
    <button className="save-btn" onClick={handleSave}>
      Save
    </button>
  </div>
</div>
  );
};

export default ProfileEdit;