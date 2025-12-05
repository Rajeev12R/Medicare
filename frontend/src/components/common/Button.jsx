// components/common/Button.jsx
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg focus:ring-primary-500',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-md hover:shadow-lg focus:ring-secondary-500',
    accent: 'bg-accent-600 hover:bg-accent-700 text-white shadow-md hover:shadow-lg focus:ring-accent-500',
    outline: 'border-2 border-primary-600 hover:bg-primary-50 text-primary-600 focus:ring-primary-500',
    ghost: 'hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const Icon = icon;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size={size === 'lg' ? 'md' : 'sm'} className={iconPosition === 'left' ? 'mr-2' : 'ml-2'} />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="mr-2" size={size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
      {Icon && iconPosition === 'right' && !loading ? (
        <Icon className="ml-2" size={size === 'lg' ? 20 : 16} />
      ) : null}
    </button>
  );
};