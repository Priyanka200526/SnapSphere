import { validateFields } from "../utils/valiadation";
import { getErrorMessage } from "../../shared/utils/errorHandler";
import toast from "react-hot-toast";

export const useFormHandler = (apiFunction, setErrors, setLoading) => {
    return async (fields, onSuccess) => {

        const validationErrors = validateFields(fields)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        try {
            setLoading?.(true)
            setErrors({})

            const data = await apiFunction(fields)
            if (!data) return
            if (data?.success) {
                toast.success(data.message || "Success 🎉")
            }

            onSuccess && onSuccess(data)

        } catch (error) {

            if (setErrors) {
                const message = getErrorMessage(error, errorMessage)

                setErrors({
                    api: message
                })
            }

            throw error
        } finally {
            setLoading?.(false)
        }
    }
}