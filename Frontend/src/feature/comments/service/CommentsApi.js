import axios from 'axios'
const commentapi = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})
export const addCommentApi = async (postId, text) => {
    const response = await commentapi.post(
        `/comments/${postId}`,
        { text }
    );

    return response.data;
};
export const getCommentsApi = async (postId) => {
    const response = await commentapi.get(
        `/comments/${postId}`
    );

    return response.data;
};
export const deleteCommentApi = async (commentId) => {
    const response = await commentapi.delete(
        `/comments/${commentId}`
    );

    return response.data;
};
export const getCommentCountApi = async (postId) => {
    const response = await commentapi.get(
        `/comments/count/${postId}`
    );
    return response.data;
}