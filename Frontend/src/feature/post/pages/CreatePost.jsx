import React, { useState, useRef } from "react";
import "../style/createpost.scss";
import { usePost } from "../hook/usePost";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BackButton from "../../../Componenet/Pageheader";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const { loading, handleCreatePost } = usePost();
  const navigate = useNavigate();

  function handleFiles(files) {
    const selectedFiles = Array.from(files);

    const previewImages = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setImages((prev) => [...prev, ...previewImages]);
  }

  function handleImageChange(e) {
    handleFiles(e.target.files);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave() {
    setDragActive(false);
  }

  function removeImage(index) {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    if (!caption.trim()) {
      toast.error("Caption is required");
      return;
    }

    const formData = new FormData();

    images.forEach((img) => {
      formData.append("images", img.file);
    });

    formData.append("caption", caption);

    try {
      await handleCreatePost(formData);

      setImages([]);
      setCaption("");

      toast.success("Post created 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create post");
    }
  }

  return (
   <>
   <BackButton/>
    <main className="create-post-page">
      <div className="form-container">

        <h1>Create Post</h1>

        <form onSubmit={handleSubmit}>
          <div
            className={`drop-area ${dragActive ? "active" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current.click()}
          >
            <p>📂 Drag & Drop or Click to Upload</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />

          {images.length > 0 && (
            <div className="preview-grid">
              {images.map((img, index) => (
                <div key={index} className="preview-item">
                  <img src={img.url} alt="preview" />
                  <button type="button" onClick={() => removeImage(index)}>
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            className="caption-input"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
          />

          <button className="button" disabled={loading}>
            {loading ? "Sharing..." : "Share"}
          </button>

        </form>
      </div>
    </main>
   </>
  );
};

export default CreatePost;