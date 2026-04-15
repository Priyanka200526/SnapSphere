export const getErrorMessage = (error, fallback = "Something went wrong") => {
    if (error?.response?.data?.message) {
        return error.response.data.message
    }

    return fallback
}