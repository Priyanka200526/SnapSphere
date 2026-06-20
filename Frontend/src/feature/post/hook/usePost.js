import { createPost, getPostDetails, getFeed, getUserPosts, deletePostApi, toggleLikePost, toggleSavePostApi } from "../services/post.api"
import { useContext, useEffect } from "react"
import { PostContext } from "../context/post.context"
import { useState } from "react"
import toast from "react-hot-toast";

export const usePost = () => {

    const context = useContext(PostContext)

    if (!context) {
        throw new Error("usePost must be used inside PostContextProvider")
    }

    const { loading, setLoading, post, setPost, feed, setFeed } = context
    const [postsCount, setPostsCount] = useState(0);

    const handleGetFeed = async () => {
        try {
            setLoading(true)
            const data = await getFeed()
            setFeed([...(data.data || [])].reverse())

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    const handleCreatePost = async (formData) => {
        try {
            setLoading(true)

            const data = await createPost(formData)

            setFeed((prev) => [
                {
                    ...data.post,
                    isLiked: false,
                    likesCount: 0
                },
                ...(prev || [])
            ])

            return data

        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setLoading(false)
        }
    }
    const handleDeletePost = async (postId) => {
        try {
            setLoading(true);

            const data = await deletePostApi(postId);

            setFeed((prev) =>
                prev?.filter((post) => post._id !== postId)
            );

            return data;

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const handleGetUserPosts = async () => {
        try {
            setLoading(true);

            const data = await getUserPosts();

            setPost(data.posts || []);
            setPostsCount(data.postsCount || 0);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleToggleLike = async (postId, isLiked) => {
        try {
            const res = await toggleLikePost(postId);

            setFeed((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? {
                            ...p,
                            isLiked: res.liked,
                            likesCount: res.liked
                                ? p.likesCount + 1
                                : p.likesCount - 1,
                        }
                        : p
                )
            );
        } catch (err) {
            console.log(err);
        }
    };
    const handleGetPostDetails = async (postid) => {
        try {
            setLoading(true);
            const data = await getPostDetails(postid);
            return data;
        } catch (error) {
            console.error("Post Details Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const handleToggleSave = async (postId) => {
        try {
            const res = await toggleSavePostApi(postId);

            setFeed((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? {
                            ...p,
                            isSaved: res.saved
                        }
                        : p
                )
            );

            if (res.saved) {
                toast.success("Post saved");
            } else {
                toast.success("Post removed from saved");
            }

        } catch (err) {
            toast.error("Failed to save post");
            console.log(err);
        }
    };


    useEffect(() => {
        handleGetFeed()
    }, [])

    return {
        loading,
        feed,
        setFeed,
        post,
        postsCount, // 🔥 add this
        handleGetFeed,
        handleCreatePost,
        handleGetUserPosts,
        handleToggleLike,
        handleGetPostDetails,
        handleDeletePost,
        handleToggleSave
    }
}