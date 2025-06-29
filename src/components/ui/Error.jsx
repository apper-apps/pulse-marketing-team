import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  title = "Oops!",
  type = "default" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" size={40} className="text-error" />
        </div>
        
        <h3 className="text-2xl font-bold text-charcoal mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={onRetry}
              icon="RefreshCw"
              iconPosition="left"
            >
              Try Again
            </Button>
            
            <p className="text-sm text-gray-500">
              If the problem persists, please contact support
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Error;