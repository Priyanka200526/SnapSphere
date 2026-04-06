import React from 'react'

export const FormGroup = ({ label, placeholder, value, onChange,type }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                id={label}
                name={label}
                required
            />
        </div>
    )
}

export default FormGroup