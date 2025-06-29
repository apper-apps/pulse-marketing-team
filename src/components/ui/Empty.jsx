import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Get started by taking your first action",
  actionText = "Get Started",
  onAction,
  icon = "Inbox",
  type = "default"
}) => {
  const getTypeSpecificContent = () => {
    switch (type) {
      case "conversations":
        return {
          title: "No conversations yet",
          message: "Start chatting with your AI helpers to see your conversation history here",
          actionText: "Browse Helpers",
          icon: "MessageSquare"
        };
      case "files":
        return {
          title: "No files uploaded",
          message: "Upload company documents, brand guidelines, and other materials to enhance your AI helpers' knowledge",
          actionText: "Upload Files",
          icon: "Upload"
        };
      case "helpers":
        return {
          title: "Meet your AI team",
          message: "Choose from 8 specialized AI helpers to get expert marketing assistance",
          actionText: "Explore Helpers",
          icon: "Users"
        };
      default:
        return { title, message, actionText, icon };
    }
  };

  const content = getTypeSpecificContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={content.icon} size={40} className="text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold text-charcoal mb-3">
          {content.title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {content.message}
        </p>
        
        {onAction && (
          <Button
            variant="primary"
            onClick={onAction}
            icon="Plus"
            iconPosition="left"
          >
            {content.actionText}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;