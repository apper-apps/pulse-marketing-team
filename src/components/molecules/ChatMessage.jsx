import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const ChatMessage = ({ 
  message, 
  helper = null, 
  showTimestamp = true,
  className = '' 
}) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 ${className}`}
    >
      <div className={`flex max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {isAssistant && helper && (
          <div className="flex-shrink-0 mr-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ 
                background: `linear-gradient(135deg, ${helper.color}20, ${helper.color}10)`,
                border: `2px solid ${helper.color}30`
              }}
            >
              {helper.avatar}
            </div>
          </div>
        )}
        
        {isUser && (
          <div className="flex-shrink-0 ml-3">
            <div className="w-10 h-10 rounded-full bg-sunset-gradient flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-white" />
            </div>
          </div>
        )}
        
        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'mr-3' : 'ml-0'}`}>
          <div 
            className={`rounded-2xl px-4 py-3 ${
              isUser 
                ? 'bg-sunset-gradient text-white ml-auto' 
                : 'bg-gray-100 text-charcoal'
            }`}
          >
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          </div>
          
          {showTimestamp && message.timestamp && (
            <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
              {format(new Date(message.timestamp), 'MMM d, h:mm a')}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;