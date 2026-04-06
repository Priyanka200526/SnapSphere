import { validateFields } from "../utils/valiadation";

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
            if (data?.success) {
                toast.success(data.message || "Success 🎉")
            }

            onSuccess && onSuccess(data)

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Something went wrong"

            setErrors({ api: message })

        } finally {
            setLoading?.(false)
        }
    }
}