// components/common/Modal.jsx
import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  type = 'default',
  showCloseButton = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  const typeClasses = {
    default: '',
    success: 'border-green-200',
    warning: 'border-yellow-200',
    error: 'border-red-200',
    info: 'border-blue-200',
  };

  const typeIcons = {
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle,
    info: Info,
    default: null,
  };

  const Icon = typeIcons[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-hard w-full ${sizeClasses[size]} animate-slide-up`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${typeClasses[type]}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className={`p-2 rounded-lg ${
                  type === 'success' ? 'bg-green-100 text-green-600' :
                  type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  type === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Icon size={24} />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
                {type === 'default' && (
                  <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"></div>
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-500 rounded-full blur-xl opacity-20"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-secondary-500 rounded-full blur-xl opacity-20"></div>
      </div>
    </div>
  );
};