import React, { useState } from 'react'
import FormGroup from '../../../Componenet/FormGroup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'
import { FaEnvelope, FaLock } from "react-icons/fa"
import { useFormHandler } from '../hook/useformhandler'
import "../style/login.scss"

const Login = () => {

    const { handleLogin, errors, setErrors, loading, setLoading } = useAuth()
    const submit = useFormHandler(handleLogin, setErrors, setLoading)
    const navigate = useNavigate()

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        submit(
            { email, password },
            () => navigate("/")
        )
    }

    return (
        <div>
            <main className="login-page">

                <div className="form-container">

                    <h2>Welcome Back </h2>
                    <p className="subtitle">Login to your account</p>

                    <form onSubmit={handleSubmit} noValidate>
                        {errors?.api && <p>{errors.api}</p>}
                        <div className={`input-group ${errors.email ? "error" : ""}`}>
                            <FaEnvelope className="icon" />
                            <FormGroup
                                value={email}
                                placeholder="Enter your email"
                                type="email"
                                onChange={(e) => setemail(e.target.value)}
                            />
                        </div>
                        {errors.email && <p className="error-text">{errors.email}</p>}

                        <div className={`input-group ${errors.password ? "error" : ""}`}>
                            <FaLock className="icon" />
                            <FormGroup
                                value={password}
                                placeholder="Enter your password"
                                type="password"
                                onChange={(e) => {
                                    setpassword(e.target.value)
                                    setErrors(prev => ({ ...prev, password: "" }))
                                }}
                            />
                        </div>
                        {errors.password && <p className="error-text">{errors.password}</p>}

                        <button type="submit" className='button' disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                            
                        </button>

                    </form>

                    <p className="register-link">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>

                </div>

            </main>
        </div>
    )
}

export default Login