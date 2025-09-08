import React from 'react'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
          error ? 'border-red-500' : ''
        }`}
        {...props}
      />
      {label && (
        <label
          htmlFor={props.id}
          className={`ml-2 text-sm font-medium ${
            error ? 'text-red-700' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
