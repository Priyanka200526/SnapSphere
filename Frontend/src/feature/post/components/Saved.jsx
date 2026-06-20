import { useEffect, useState } from "react";
import { usePost } from "../hook/usePost";
import { useComment } from "../../comments/hook/useComments";
import PostCard from "./PostCard";
import '../style/saved.scss'

const Saved = () => {
    const {
        feed,
        handleGetFeed,
        handleToggleLike,
        handleDeletePost,
        handleToggleSave
    } = usePost();
    const { handleGetCommentCount } = useComment();

    const [isLoading, setIsLoading] = useState(true);
    const [commentCounts, setCommentCounts] = useState({});
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const loadSaved = async () => {
            setIsLoading(true);
            await handleGetFeed();
            setIsLoading(false);
        };
        loadSaved();
    }, []);

    const savedPosts = feed.filter((post) => post.isSaved);

    useEffect(() => {
        const fetchCounts = async () => {
            const counts = {};
            for (const post of savedPosts) {
                counts[post._id] = await handleGetCommentCount(post._id);
            }
            setCommentCounts(counts);
        };
        if (savedPosts.length > 0) {
            fetchCounts();
        }
    }, [feed]);

    return (
        <div className="saved-page">
            <div className="saved-page__header">
                <h2>Saved Posts</h2>
                <span className="saved-page__count">
                    {savedPosts.length} {savedPosts.length === 1 ? "post" : "posts"}
                </span>
            </div>

            {isLoading ? (
                <div className="saved-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="saved-item saved-item--skeleton" />
                    ))}
                </div>
            ) : savedPosts.length === 0 ? (
                <div className="saved-empty">
                    <div className="saved-empty__icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17l-6-4-6 4V4Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h3>No saved posts yet</h3>
                    <p>Posts you save will show up here.</p>
                </div>
            ) : (
                <div className="saved-grid">
                    {savedPosts.map((post) => (
                        <div
                            key={post._id}
                            className="saved-item"
                            onClick={() => setSelectedPost(post)}
                        >
                            <img src={post.images?.[0]} alt="saved post" loading="lazy" />
                            {post.images?.length > 1 && (
                                <span className="saved-item__multi" title={`${post.images.length} photos`}>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M16.5 4.5h-9A2 2 0 0 0 5.5 6.5v9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <rect
                                            x="8.5"
                                            y="8.5"
                                            width="10"
                                            height="10"
                                            rx="2"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </span>
                            )}
                            <div className="saved-item__overlay">
                                <span className="saved-item__stat">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 21s-7.5-4.6-10-9.3C.3 8 2 4.5 5.6 4c2-.3 3.9.6 5 2.2C11.7 4.6 13.6 3.7 15.6 4c3.6.5 5.3 4 3.6 7.7C16.5 16.4 12 21 12 21z" />
                                    </svg>
                                    {post.likesCount || 0}
                                </span>
                                <span className="saved-item__stat">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M21 11.5a8.5 8.5 0 1 1-3.8-7.1L21 3l-1.2 4.1A8.5 8.5 0 0 1 21 11.5z" />
                                    </svg>
                                    {commentCounts[post._id] ?? 0}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPost && (
                <div
                    className="saved-modal-overlay"
                    onClick={() => setSelectedPost(null)}
                >
                    <div
                        className="saved-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="saved-modal__close"
                            onClick={() => setSelectedPost(null)}
                        >
                            &times;
                        </button>
                        <PostCard
                            user={selectedPost.user}
                            post={selectedPost}
                            handleToggleLike={handleToggleLike}
                            handleDeletePost={handleDeletePost}
                            handleToggleSave={handleToggleSave}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Saved;