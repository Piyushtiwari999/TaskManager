import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={twMerge(
          'w-full px-4 py-2 rounded-lg border border-gray-200 bg-white transition-all',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
          'dark:bg-dark-lighter dark:border-white/10 dark:text-white',
          error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : '',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
