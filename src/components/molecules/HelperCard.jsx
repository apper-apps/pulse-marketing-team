import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const HelperCard = ({ helper, showUsage = false, className = '' }) => {
  const usageCount = helper.usage_count || 0;
  const lastUsed = helper.last_used;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`helper-card-hover bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${className}`}
    >
      <Link to={`/app/helper/${helper.Id}`} className="block">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ 
              background: `linear-gradient(135deg, ${helper.color}20, ${helper.color}10)`,
              border: `2px solid ${helper.color}30`
            }}
          >
            {helper.avatar}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-charcoal truncate">
                {helper.name}
              </h3>
              {showUsage && usageCount > 0 && (
                <Badge variant="primary" size="sm">
                  {usageCount} messages
                </Badge>
              )}
            </div>
            
            <p className="text-sm font-medium text-primary mb-2">
              {helper.specialty}
            </p>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {helper.description}
            </p>
            
            {/* Specialties */}
            <div className="flex flex-wrap gap-1 mb-3">
              {helper.specialties?.slice(0, 2).map((specialty, index) => (
                <Badge key={index} variant="default" size="sm">
                  {specialty}
                </Badge>
              ))}
              {helper.specialties?.length > 2 && (
                <Badge variant="default" size="sm">
                  +{helper.specialties.length - 2} more
                </Badge>
              )}
            </div>
            
            {/* Last used */}
            {showUsage && lastUsed && (
              <div className="flex items-center text-xs text-gray-500">
                <ApperIcon name="Clock" size={12} className="mr-1" />
                Last used {new Date(lastUsed).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        {/* Chat arrow */}
        <div className="flex justify-end mt-4">
          <div className="flex items-center text-primary text-sm font-medium">
            Start chatting
            <ApperIcon name="ArrowRight" size={16} className="ml-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HelperCard;