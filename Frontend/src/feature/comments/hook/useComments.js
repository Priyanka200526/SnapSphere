import { useContext } from "react";
import { CommentContext } from "../context/CommentContext.jsx";

import {
    addCommentApi,
    getCommentsApi,
    deleteCommentApi,
 getCommentCountApi
} from "../service/CommentsApi.js";

export const useComment = () => {

    const { comments, setComments } = useContext(CommentContext);

    async function handleGetComments(postId) {

        try {

            const data = await getCommentsApi(postId);

            setComments(data.comments);

            return data.comments;

        } catch (err) {

            console.log(err);

        }

    }
    async function handleAddComment(postId, text) {

        try {

            const data = await addCommentApi(postId, text);
            console.log(data.comment);

            setComments(prev => [data.comment, ...prev]);

            return data.comment;

        } catch (err) {
            console.log(err);
            console.log(err.response?.data);

        }

    }
    async function handleDeleteComment(commentId) {

        try {

            await deleteCommentApi(commentId);

            setComments(prev =>
                prev.filter(comment => comment._id !== commentId)
            );

        } catch (err) {

            console.log(err);

        }

    }
    async function handleGetCommentCount(postId) {
        try {
            const data = await getCommentCountApi(postId);
            return data.count;
        }
        catch (err) {
            console.log(err);
            return 0;
        }
    }

    return {
        comments,
        handleGetComments,
        handleAddComment,
        handleDeleteComment,
        handleGetCommentCount
    };

};