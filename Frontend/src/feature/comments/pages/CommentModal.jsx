import "../style/commentModel.scss";

import { useEffect, useState } from "react";
import { useComment } from "../hook/useComments";
import { useAuth } from "../../auth/hook/useAuth";

const CommentModal = ({
    postId,
    onClose,
    onCommentAdded
}) => {

    const {
        comments,
        handleGetComments,
        handleAddComment,
        handleDeleteComment
    } = useComment();

    const { user: currentUser } = useAuth();

    const [text, setText] = useState("");

    useEffect(() => {

        handleGetComments(postId);

    }, [postId]);
    async function submitComment() {

        if (!text.trim()) return;
        const comment = await handleAddComment(postId, text);

        if (comment) {
            onCommentAdded();
        }
        setText("");

    }

    return (

        <div
            className="comment-modal-overlay"
            onClick={onClose}
        >

            <div
                className="comment-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="comment-header">

                    <h2>
                        Comments ({comments?.length || 0})
                    </h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="comments-container">

                    {
                        comments?.length > 0 ? (

                            comments.map((comment) => (

                                <div
                                    key={comment._id}
                                    className="comment-item"
                                >

                                    <img
                                        className="comment-avatar"
                                        src={
                                            comment.user?.profileImage ||
                                            "/default-avatar.png"
                                        }
                                        alt=""
                                    />

                                    <div className="comment-content">

                                        <p>
                                            <strong>
                                                {comment.user?.username}
                                            </strong>

                                            {" "}
                                            {comment.text}
                                        </p>

                                    </div>

                                    {
                                        comment.user?._id === currentUser?._id && (
                                            <button
                                                className="delete-comment-btn"
                                                onClick={() =>
                                                    handleDeleteComment(comment._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        )
                                    }

                                </div>

                            ))

                        ) : (

                            <div className="empty-comments">

                                <h3>No comments yet</h3>

                                <p>
                                    Be the first to comment.
                                </p>

                            </div>

                        )
                    }

                </div>

                <div className="comment-input-container">

                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={text}
                        onChange={(e) =>
                            setText(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                submitComment();
                            }
                        }}
                    />

                    <button
                        onClick={submitComment}
                        disabled={!text.trim()}
                    >
                        Post
                    </button>

                </div>

            </div>

        </div>

    );

};

export default CommentModal;