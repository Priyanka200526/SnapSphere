import { createPost, likePost, unLikePost, getPostDetails, getFeedPosts } from "../services/post.api"
import { useContext, useEffect } from "react"
import { PostContext } from "../context/post.context"

export const usePost = () => {

    const context = useContext(PostContext)

    if (!context) {
        throw new Error("usePost must be used inside PostContextProvider")
    }

    const { loading, setLoading, post, setPost, feed, setFeed } = context

    const handleGetFeed = async () => {
        try {
            setLoading(true)
            const data = await getFeedPosts()
            setFeed([...data.posts].reverse())
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePost = async (formData) => {
        try {
            setLoading(true)

            const data = await createPost(formData) // 🔥 direct formData

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

    const handleLike = async (postId) => {
        await likePost(postId)

        setFeed((prev) =>
            prev.map((p) =>
                p._id === postId
                    ? {
                        ...p,
                        isLiked: true,
                        likesCount: (p.likesCount || 0) + 1
                    }
                    : p
            )
        )
    }

    const handleUnLike = async (postId) => {
        try {
            await unLikePost(postId)
            setFeed((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? {
                            ...p,
                            isLiked: false,
                            likesCount: Math.max((p.likesCount || 1) - 1, 0)
                        }
                        : p
                )
            )
            await handleGetFeed()
        } catch (error) {
            console.error(error)
        }
    }
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
    const handleGetFeedPosts = async () => {
        try {
            setLoading(true);
            const data = await getFeedPosts();
            return data;
        } catch (error) {
            console.error("Feed Posts Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetFeedPosts
    }, [])

    return {
        loading,
        feed,
        post,
        handleGetFeed,
        handleCreatePost,
        handleLike,
        handleUnLike,
        handleGetPostDetails,
        handleGetFeedPosts
    }
}