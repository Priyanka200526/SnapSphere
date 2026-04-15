import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/auth.context'
import {
    login, register, getCurrentUser, logout, verifyUser, updateProfileApi
} from '../services/auth.api'
import { handleApi } from '../../shared/utils/apihandler'

export const useAuth = () => {
    const { user, setUser, loading, setLoading, errors, setErrors } = useContext(AuthContext)

    const handlegetCurrentUser = async () => {
        try {
            const data = await getCurrentUser()
            setUser(data.user)
        } catch (error) {
            if (error?.response?.status === 401) {
                setUser(null) 
            }
        } finally {
            setLoading(false)
        }
    }

    //  Register
    const handleRegister = async (formData) => {
        return handleApi({
            apiCall: () => register(formData),
            setLoading,
            setErrors,
            errorMessage: "Registration failed"
        })
    }

    //  Verify OTP
    const handleVerifyUser = async (formData) => {
        return handleApi({
            apiCall: () => verifyUser(formData),
            setLoading,

            onSuccess: (data) => {
                setUser(data.user)
            },
            errorMessage: "OTP verification failed"
        })
    }

    //  Login
    const handleLogin = async (formData) => {
        return handleApi({
            apiCall: () => login(formData),
            setLoading,
            setErrors,

            onSuccess: (data) => {
                setUser(data.user)
            },

            errorMessage: "Login failed"
        })
    }

    //  Logout
    const handleLogout = async () => {
        return handleApi({
            apiCall: () => logout(),
            setLoading,

            onSuccess: () => {
                setUser(null)
            }
        })
    }

    //  Update Profile
    const handleUpdateProfile = async (formData) => {
        return handleApi({
            apiCall: () => updateProfileApi(formData),
            setLoading,

            onSuccess: (data) => {
                if (data?.user) {
                    setUser(data.user)
                }
            }
        })
    }
    useEffect(() => {
        handlegetCurrentUser()
    }, [])

    return {
        user,
        setUser,
        loading,
        setLoading,
        errors,
        setErrors,
        handleLogin,
        handleRegister,
        handleVerifyUser,
        handleLogout,
        handleUpdateProfile,
    }
}