export function validateFields(fields) {
    let errors = {}

    // EMAIL
    if ("email" in fields) {
        if (!fields.email) {
            errors.email = "Email is required"
        } else if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
            errors.email = "Enter a valid email"
        }
    }

    // OTP
    if ("otp" in fields) {
        if (!fields.otp) {
            errors.otp = "OTP is required"
        }
    }

    // USERNAME (only if exists)
    if ("username" in fields) {
        if (!fields.username) {
            errors.username = "Username is required"
        } else if (fields.username.length < 3) {
            errors.username = "Username must be at least 3 characters"
        }
    }

    // PASSWORD (only if exists)
    if ("password" in fields) {
        if (!fields.password) {
            errors.password = "Password is required"
        } else if (fields.password.length < 6) {
            errors.password = "Password must be at least 6 characters"
        }
    }
    return errors
}