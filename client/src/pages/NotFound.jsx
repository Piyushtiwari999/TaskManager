import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-9xl font-black text-primary-600 mb-4 opacity-20">404</h1>
      <h2 className="text-3xl font-bold dark:text-white mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved to a different location.
      </p>
      <Link to="/dashboard">
        <Button>
          <ArrowLeft size={20} /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
