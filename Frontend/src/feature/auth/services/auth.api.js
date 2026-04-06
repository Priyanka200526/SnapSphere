import axios from 'axios'
const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})

export async function register({ email, username, password }) {
    const res = await api.post("/auth/register", {
        email, username, password
    })
    return res.data
}
export async function verifyUser({ email, otp }) {
    const res = await api.post("/otp/verify-otp", {
        email, otp
    })
    return res.data

}
export async function login({ email, password }) {
    const res = await api.post("/auth/login", {
        email, password
    })
    return res.data
}
export async function getme() {
    const res = await api.get("/auth/getme")
    return res.data
}
export async function logout() {
    const res = await api.post("/auth/logout")
    return res.data
}
export async function updateProfileApi(formData) {
    const res = await api.put("/auth/update-profile", formData, {
        withCredentials: true,
    });
    return res.data;
}
