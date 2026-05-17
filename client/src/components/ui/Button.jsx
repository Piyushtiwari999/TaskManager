import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 dark:bg-dark-lighter dark:text-white dark:border-white/10 dark:hover:bg-dark-lightest',
    outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-white/5',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={twMerge(
        'rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
