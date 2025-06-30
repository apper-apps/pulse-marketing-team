import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ChatMessage from "@/components/molecules/ChatMessage";
import QuickActions from "@/components/molecules/QuickActions";
import Loading from "@/components/ui/Loading";
import { conversationsService } from "@/services/api/conversationsService";
import { aiService } from "@/services/api/aiService";
import { helpersService } from "@/services/api/helpersService";
import conversationsData from "@/services/mockData/conversations.json";
import usersData from "@/services/mockData/users.json";
import knowledgeBaseData from "@/services/mockData/knowledgeBase.json";
import helpersData from "@/services/mockData/helpers.json";
const ChatInterface = ({ helper, conversationId = null }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, [helper.Id, conversationId]);

const initializeChat = async () => {
    try {
      if (conversationId) {
        // Load existing conversation
        const conversation = await conversationsService.getById(conversationId);
        const existingMessages = conversation.messages ? 
          (typeof conversation.messages === 'string' ? JSON.parse(conversation.messages) : conversation.messages) : [];
        setMessages(existingMessages);
        setCurrentConversationId(conversationId);
      } else {
        // Only add greeting for completely new conversations
        // Check if there are already messages to prevent duplicate greetings
        if (messages.length === 0) {
          const greetingMessage = {
            id: `greeting-${Date.now()}`,
            role: 'assistant',
            content: helper.greeting,
            timestamp: new Date().toISOString()
          };
          setMessages([greetingMessage]);
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to load conversation');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    setTyping(true);

    try {
      let conversationId = currentConversationId;
      
      // Create conversation if it doesn't exist
      if (!conversationId) {
        const newConversation = await conversationsService.create({
          helper_id: helper.Id,
          title: userMessage.content.substring(0, 50) + (userMessage.content.length > 50 ? '...' : ''),
          messages: [userMessage]
        });
        conversationId = newConversation.Id;
        setCurrentConversationId(conversationId);
      } else {
        // Add user message to existing conversation
        await conversationsService.addMessage(conversationId, userMessage);
      }

      // Get AI response
      const aiResponse = await aiService.generateResponse(
        helper,
        userMessage.content,
        messages
      );

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant message
      await conversationsService.addMessage(conversationId, assistantMessage);
      
      // Update helper usage stats
      await helpersService.updateUsageStats(helper.Id, 1);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const handleQuickAction = async (action) => {
    setLoading(true);
    setTyping(true);

try {
      const response = await aiService.processQuickAction(helper, action, knowledgeBaseData);
      const actionMessage = {
        id: `action-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, actionMessage]);

      // Save to conversation if exists
      if (currentConversationId) {
        await conversationsService.addMessage(currentConversationId, actionMessage);
      }

      // Update usage stats
      await helpersService.updateUsageStats(helper.Id, 1);
      
    } catch (error) {
      console.error('Error processing quick action:', error);
      toast.error('Failed to process action. Please try again.');
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ 
              background: `linear-gradient(135deg, ${helper.color}20, ${helper.color}10)`,
              border: `2px solid ${helper.color}30`
            }}
          >
            {helper.avatar}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-charcoal">
              {helper.name}
            </h2>
            <p className="text-sm text-gray-600">
              {helper.specialty} • {typing ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              helper={message.role === 'assistant' ? helper : null}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-3"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ 
                background: `linear-gradient(135deg, ${helper.color}20, ${helper.color}10)`,
                border: `2px solid ${helper.color}30`
              }}
            >
              {helper.avatar}
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {helper.quickActions && messages.length <= 2 && (
        <div className="px-4 pb-4">
          <QuickActions
            actions={helper.quickActions}
            onActionClick={handleQuickAction}
            loading={loading}
          />
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${helper.name} anything about ${helper.specialty.toLowerCase()}...`}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={loading}
            />
          </div>
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            icon={loading ? "Loader2" : "Send"}
            className={loading ? "animate-spin" : ""}
          >
            {loading ? '' : 'Send'}
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>47/500 messages used</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;