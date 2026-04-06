export const getErrorMessage = (error, fallback = "Something went wrong") => {
    // sirf backend error allow
    if (error?.response?.data?.message) {
        return error.response.data.message
    }

    // ❌ dev error ignore karo
    return fallback
}