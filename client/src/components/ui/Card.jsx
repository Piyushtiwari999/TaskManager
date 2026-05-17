import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={twMerge(
        'bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all',
        'dark:bg-dark-lighter dark:border-white/5 dark:shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
