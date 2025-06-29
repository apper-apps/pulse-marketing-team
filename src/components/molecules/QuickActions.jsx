import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const QuickActions = ({ 
  actions = [], 
  onActionClick, 
  loading = false,
  className = '' 
}) => {
  const handleActionClick = (action) => {
    if (onActionClick && !loading) {
      onActionClick(action);
    }
  };

  if (!actions.length) return null;

  return (
    <div className={`bg-gray-50 rounded-xl p-4 ${className}`}>
      <h4 className="text-sm font-medium text-charcoal mb-3">
        Quick Actions
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left h-auto py-2 px-3 text-xs"
              onClick={() => handleActionClick(action)}
              disabled={loading}
            >
              {action}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;