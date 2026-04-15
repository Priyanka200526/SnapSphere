import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api/post",
    withCredentials: true
})
export async function getFeed() {
    const response = await api.get('/feed')
    return response.data
}
export async function createPost(formData) {
    const res = await api.post("/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}
export async function deletePostApi(postId) {
    const res = await api.delete(`/delete/${postId}`);
    return res.data;
}
export const getUserPosts = async () => {
    const res = await api.get("/")
    return res.data
}

export const getPostDetails = async (postid) => {
    const res = await api.get(`/details/${postid}`)
    return res.data
}
export const toggleLikePost = async (postid) => {
    const res = await api.post(`/like/${postid}`)
    return res.data
}