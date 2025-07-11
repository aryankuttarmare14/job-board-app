import React from "react"

const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-t-blue-600 animate-spin`}></div>
      </div>
      {text && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner 