import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/auth.context'

import {
    login,
    register,
    getCurrentUser,
    logout,
    verifyUser,
    updateProfileApi,
    getAllUsersApi,
    getUserByIdApi
} from '../services/auth.api'

import { handleApi } from '../../shared/utils/apihandler'

export const useAuth = () => {

    const {
        user,
        setUser,

        authLoading,
        setAuthLoading,

        profileLoading,
        setProfileLoading,

        errors,
        setErrors,

        profileUser,
        setProfileUser,

        profilePosts,
        setProfilePosts

    } = useContext(AuthContext)

    // CURRENT USER

    const handlegetCurrentUser = async () => {

        try {

            const data = await getCurrentUser()

            setUser(data.user)

        } catch (error) {

            if (error?.response?.status === 401) {
                setUser(null)
            }

        } finally {

            setAuthLoading(false)

        }

    }

    // REGISTER

    const handleRegister = async (formData) => {

        return handleApi({

            apiCall: () => register(formData),

            setLoading: setAuthLoading,

            setErrors,

            errorMessage: "Registration failed"

        })

    }

    // VERIFY USER

    const handleVerifyUser = async (formData) => {

        return handleApi({

            apiCall: () => verifyUser(formData),

            setLoading: setAuthLoading,

            onSuccess: (data) => {

                setUser(data.user)

            },

            errorMessage: "OTP verification failed"

        })

    }

    // LOGIN

    const handleLogin = async (formData) => {

        return handleApi({

            apiCall: () => login(formData),

            setLoading: setAuthLoading,

            setErrors,

            onSuccess: (data) => {

                setUser(data.user)

            },

            errorMessage: "Login failed"

        })

    }

    // LOGOUT

    const handleLogout = async () => {

        return handleApi({

            apiCall: () => logout(),

            setLoading: setAuthLoading,

            onSuccess: () => {

                setUser(null)

            }

        })

    }

    // UPDATE PROFILE

    const handleUpdateProfile = async (formData) => {

        return handleApi({

            apiCall: () => updateProfileApi(formData),

            setLoading: setAuthLoading,

            onSuccess: (data) => {

                if (data?.user) {

                    setUser(data.user)

                }

            }

        })

    }

    // GET USER PROFILE

    const handleGetUserById = async (id) => {

        return handleApi({

            apiCall: () => getUserByIdApi(id),

            setLoading: setProfileLoading,

            onSuccess: (data) => {

                if (data?.user) {

                    setProfileUser(data.user)

                }

                if (data?.posts) {

                    setProfilePosts(data.posts)

                }

            },

            errorMessage: "Failed to fetch user details"

        })

    }

    useEffect(() => {

        handlegetCurrentUser()

    }, [])

    return {

        user,
        setUser,

        authLoading,
        setAuthLoading,

        profileLoading,
        setProfileLoading,

        errors,
        setErrors,

        profileUser,
        setProfileUser,

        profilePosts,
        setProfilePosts,

        handleLogin,
        handleRegister,
        handleVerifyUser,
        handleLogout,
        handleUpdateProfile,
        handleGetUserById

    }

}