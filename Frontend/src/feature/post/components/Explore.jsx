import { useEffect, useState } from "react";
import { usePost } from "../hook/usePost";
import { useComment } from "../../comments/hook/useComments";
import PostCard from "./PostCard";
import '../style/explore.scss'

const Explore = () => {
    const {
        exploreFeed,
        handleGetExploreFeed,
        handleToggleLike,
        handleDeletePost,
        handleToggleSave
    } = usePost();
    const { handleGetCommentCount } = useComment();

    const [isLoading, setIsLoading] = useState(true);
    const [commentCounts, setCommentCounts] = useState({});
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const loadExplore = async () => {
            setIsLoading(true);
            await handleGetExploreFeed();
            setIsLoading(false);
        };
        loadExplore();
    }, []);

    useEffect(() => {
        const fetchCounts = async () => {
            const counts = {};
            for (const post of exploreFeed) {
                counts[post._id] = await handleGetCommentCount(post._id);
            }
            setCommentCounts(counts);
        };
        if (exploreFeed.length > 0) {
            fetchCounts();
        }
    }, [exploreFeed]);

    return (
        <div className="explore-page">
            <div className="explore-page__header">
                <h2>Explore</h2>
            </div>

            {isLoading ? (
                <div className="explore-grid">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="explore-item explore-item--skeleton" />
                    ))}
                </div>
            ) : exploreFeed.length === 0 ? (
                <div className="explore-empty">
                    <div className="explore-empty__icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                            <path
                                d="M15.5 8.5l-2 5-5 2 2-5 5-2Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h3>Nothing to explore yet</h3>
                    <p>New posts from people you don't follow will show up here.</p>
                </div>
            ) : (
                <div className="explore-grid">
                    {exploreFeed.map((post) => (
                        <div
                            key={post._id}
                            className="explore-item"
                            onClick={() => setSelectedPost(post)}
                        >
                            <img src={post.images?.[0]} alt="explore post" loading="lazy" />
                            {post.images?.length > 1 && (
                                <span className="explore-item__multi" title={`${post.images.length} photos`}>
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
                            <div className="explore-item__overlay">
                                <span className="explore-item__stat">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 21s-7.5-4.6-10-9.3C.3 8 2 4.5 5.6 4c2-.3 3.9.6 5 2.2C11.7 4.6 13.6 3.7 15.6 4c3.6.5 5.3 4 3.6 7.7C16.5 16.4 12 21 12 21z" />
                                    </svg>
                                    {post.likesCount || 0}
                                </span>
                                <span className="explore-item__stat">
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
                    className="explore-modal-overlay"
                    onClick={() => setSelectedPost(null)}
                >
                    <div
                        className="explore-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="explore-modal__close"
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

export default Explore;