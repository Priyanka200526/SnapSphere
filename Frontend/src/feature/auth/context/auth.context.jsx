import { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState({});

    return (
        <AuthContext.Provider value={{
            user, setUser, loading, setLoading, errors,
            setErrors
        }}>
            {children}
        </AuthContext.Provider>
    )
}
