// components/common/LoadingSpinner.jsx
import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-2 border-primary-200 rounded-full`}
        ></div>
        <div
          className={`${sizeClasses[size]} border-2 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}
        ></div>
      </div>
    </div>
  );
};