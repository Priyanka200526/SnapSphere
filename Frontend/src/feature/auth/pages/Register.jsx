import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'
import FormGroup from '../../../Componenet/FormGroup'
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"
import { useFormHandler } from '../hook/useformhandler'
import "../style/register.scss"

const Register = () => {

  const { handleRegister, errors, setErrors, loading, setLoading } = useAuth()
  const navigate = useNavigate()
  const submit = useFormHandler(handleRegister, setErrors, setLoading)

  const [username, setUsername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    submit(
      { email, username, password },
      () => navigate("/verify-otp", { state: { email } })
    )
  }

  return (
    <div>
      <main className="register-page">
        <div className="form-container">

          <h2>Create Account</h2>

          <form onSubmit={handleSubmit} noValidate>

            {errors.api && <p className="error-text">{errors.api}</p>}

            <div className={`input-group ${errors.username ? "error" : ""}`}>
              <FaUser className="icon" />
              <FormGroup
                value={username}
                placeholder="Enter your username"
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value)
                  setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors.username
                    return newErrors
                  })
                }}
              />
            </div>
            {errors.username && <p className="error-text">{errors.username}</p>}

            <div className={`input-group ${errors.email ? "error" : ""}`}>
              <FaEnvelope className="icon" />
              <FormGroup
                value={email}
                placeholder="Enter your email"
                type="email"
                onChange={(e) => {
                  setemail(e.target.value)
                  setErrors(prev => ({ ...prev, email: "" }))
                }}
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
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>

        </div>
      </main>
    </div>
  )
}

export default Register