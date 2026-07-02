// components/StoryFeed.jsx
import { useEffect, useState, useRef } from "react";
import { useStory } from "../hook/useStory";
import StoryViewer from "./StoryViewer";
import StoryEditor from "./StoryEditor";
import '../style/storyfeed.scss'

const StoryFeed = () => {

  const { stories, handleGetStoriesFeed, handleUploadStory } = useStory();
  const [groupedStories, setGroupedStories] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // editor ke liye
  const fileInputRef = useRef(null);

  useEffect(() => {
    handleGetStoriesFeed();
  }, []);

  useEffect(() => {

    const groups = {};


    stories.forEach((story) => {
      const uid = story?.userId?._id;
      if (!uid) return;

      if (!groups[uid]) {
        groups[uid] = {
          userId: story.userId,
          stories: []
        };
      }


      groups[uid].stories.push(story);
    });

    setGroupedStories(Object.values(groups));

  }, [stories]);

  function handleAddStoryClick() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(e) {

    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    e.target.value = ""; 
  }

  async function handleEditorShare(finalFile, textItems) {

    setUploading(true);
    try {
      await handleUploadStory(finalFile, textItems);
      await handleGetStoriesFeed();
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  }

  return (
    <div className="story-feed-wrapper">

      <div className="story-feed">

        <div className="story-item" onClick={handleAddStoryClick}>
          <div className="story-add">
            {uploading ? <span className="story-add-spinner" /> : <span>+</span>}
          </div>
          <span className="story-username">Your story</span>

          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleFileSelected}
            style={{ display: "none" }}
          />
        </div>

        {groupedStories?.length === 0 ? (
          null
        ) : (
          groupedStories.map((group) => {

            return (
              <div
                className="story-item"
                key={group.userId._id}
                onClick={() => setActiveGroup(group.stories)}
              >
                <div className="story-ring">
                  <div className="story-ring-inner">
                    <img
                      className="story-avatar"
                      src={group.userId?.profileImage}
                      alt={group.userId?.username}
                    />
                  </div>
                </div>
                <span className="story-username">{group.userId?.username}</span>
              </div>
            );

          })
        )}

      </div>
      {selectedFile && (
        <StoryEditor
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onShare={handleEditorShare}
        />
      )}

      {activeGroup && (
        <StoryViewer
          userStories={activeGroup}
          onClose={() => setActiveGroup(null)}
        />
      )}

    </div>
  );

};

export default StoryFeed;
