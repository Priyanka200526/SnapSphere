import { getErrorMessage } from "./errorHandler"
import toast from "react-hot-toast";
export const handleApi = async ({
    apiCall,
    setLoading,
    setErrors,
    onSuccess,
    errorMessage = "Something went wrong"
}) => {
    try {
        setLoading?.(true)
        const data = await apiCall()
        if (data?.success === false) {
            const message = data.message || errorMessage

            setErrors?.({ api: message })
            toast.error(message)

            throw new Error(message)   // 🔥 IMPORTANT
        }

        if (onSuccess) {
            onSuccess(data)
        }

        return data

    } catch (error) {

        if (setErrors) {
            const message = getErrorMessage(error, errorMessage)

            setErrors({
                api: message
            })
            toast.error(message)
        }
    }

    finally {
        setLoading?.(false)
    }
}