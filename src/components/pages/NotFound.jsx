import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto text-center px-6">
        <div className="mb-8">
          <ApperIcon 
            name="AlertCircle" 
            size={64} 
            className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
          />
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            404
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/app"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Go to Dashboard
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          If you believe this is an error, please contact support.
        </div>
      </div>
    </div>
  );
};

export default NotFound;