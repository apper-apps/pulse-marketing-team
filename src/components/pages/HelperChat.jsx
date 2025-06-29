import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Dashboard from "@/components/pages/Dashboard";
import ChatInterface from "@/components/organisms/ChatInterface";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { conversationsService } from "@/services/api/conversationsService";
import { helpersService } from "@/services/api/helpersService";
const HelperChat = () => {
  const { helperId } = useParams();
  const [helper, setHelper] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
const loadHelperData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [helperData, helperConversations] = await Promise.all([
        helpersService.getById(helperId),
        conversationsService.getByHelper(helperId)
      ]);
      
      setHelper(helperData);
      setConversations(helperConversations);
      setKnowledgeBase(helperData?.knowledgeBase || []);
    } catch (err) {
      setError('Failed to load helper data. Please try again.');
      console.error('Error loading helper:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (helperId) {
      loadHelperData();
    }
  }, [helperId]);

  if (loading) return <Loading type="chat" />;
  if (error) return <Error message={error} onRetry={loadHelperData} />;
  if (!helper) return <Error message="Helper not found" />;

  return (
    <div className="h-full flex">
      {/* Conversation History Sidebar */}
      <motion.div
        initial={{ width: showHistory ? 320 : 0 }}
        animate={{ width: showHistory ? 320 : 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 border-r border-gray-200 overflow-hidden"
      >
        {showHistory && (
          <div className="w-80 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-charcoal">Chat History</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setShowHistory(false)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {conversations.length > 0 ? (
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <Link
                      key={conversation.Id}
                      to={`/app/helper/${helperId}?conversation=${conversation.Id}`}
                      className="block p-3 rounded-lg bg-white hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <p className="text-sm font-medium text-charcoal truncate">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(conversation.updated_at).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="MessageSquare" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/app">
                <Button variant="ghost" size="sm" icon="ArrowLeft">
                  Back to Dashboard
                </Button>
              </Link>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${helper.color}20, ${helper.color}10)`,
                    border: `2px solid ${helper.color}30`
                  }}
                >
                  {helper.avatar}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-charcoal">
                    {helper.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {helper.specialty}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon="History"
                onClick={() => setShowHistory(!showHistory)}
              >
                History
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                icon="Download"
              >
                Export
              </Button>
            </div>
          </div>
</div>

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface helper={helper} knowledgeBase={knowledgeBase} />
        </div>
      </div>
    </div>
  );
};

export default HelperChat;