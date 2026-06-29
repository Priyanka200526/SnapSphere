// components/StoryViewer.jsx
import { useEffect, useState, useRef } from "react";
import { useStory } from "../hook/useStory";
import "../style/storyfeed.scss"

const STORY_DURATION = 5000;

const StoryViewer = ({ userStories, onClose }) => {

  const { handleViewStory } = useStory();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const currentStory = userStories?.[currentIndex];

  function goToNext() {

    clearInterval(intervalRef.current);

    if (currentIndex < userStories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }

  }

  function goToPrev() {

    clearInterval(intervalRef.current);

    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }

  }
  function formatTime(date) {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }


  useEffect(() => {

    if (!currentStory) {
      onClose();
      return;
    }

    handleViewStory(currentStory._id);
    setProgress(0);

    intervalRef.current = setInterval(() => {

      setProgress((prev) => {

        if (prev >= 100) {
          goToNext();
          return 0;
        }

        return prev + 100 / (STORY_DURATION / 100);

      });

    }, 100);

    return () => clearInterval(intervalRef.current);

  }, [currentIndex, currentStory]);

  if (!currentStory) {
    return null;
  }

  return (
    <div className="story-viewer-overlay" onClick={onClose}>

      <div className="story-viewer-content" onClick={(e) => e.stopPropagation()}>

        <div className="story-progress-row">
          {userStories.map((_, idx) => (
            <div className="story-progress-track" key={idx}>
              <div
                className="story-progress-fill"
                style={{
                  width:
                    idx < currentIndex ? "100%" :
                      idx === currentIndex ? `${progress}%` : "0%"
                }}
              />
            </div>
          ))}
        </div>

        <div className="story-header">
          <div className="story-header-user">
            <img
              className="story-header-avatar"
              src={currentStory?.userId?.profileImage}
              alt={currentStory?.userId?.username}
            />
            <span className="story-header-username">{currentStory?.userId?.username}</span>
            <span className="story-header-time">
              {formatTime(currentStory?.createdAt)}
            </span>
          </div>
          <button className="story-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="story-nav-zone left" onClick={goToPrev} />
        <div className="story-nav-zone right" onClick={goToNext} />

        {currentStory?.mediaType === "image" ? (
          <img className="story-media" src={currentStory.mediaUrl} alt="story" />
        ) : (
          <video className="story-media" src={currentStory?.mediaUrl} autoPlay />
        )}

      </div>

    </div>
  );

};

export default StoryViewer;