import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  isLoading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-[20px] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'

  const variantClasses = {
    primary:
      'bg-[rgb(1,180,228)] hover:bg-[rgb(1,180,228)] text-white focus:ring-blue-500',
    secondary:
      'bg-gray-600 hover:bg-gray-700 text-white focus:ring-[rgb(1,180,228)]',
    outline:
      'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-[rgb(1,180,228)]',
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 ',
    large: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex justify-center items-center my-2.5">
          <div className="loader flex space-x-1">
            <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
            <div
              className="w-1 h-1 bg-white rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-1 h-1 bg-white rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
