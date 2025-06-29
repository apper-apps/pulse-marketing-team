import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HelperCard from '@/components/molecules/HelperCard';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { helpersService } from '@/services/api/helpersService';
import { conversationsService } from '@/services/api/conversationsService';

const Dashboard = () => {
  const [helpers, setHelpers] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [helpersData, conversationsData] = await Promise.all([
        helpersService.getAll(),
        conversationsService.getAll()
      ]);
      
      setHelpers(helpersData);
      setRecentConversations(conversationsData.slice(0, 5)); // Show 5 most recent
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="helpers" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const totalMessages = 47;
  const messageLimit = 500;
  const usagePercentage = (totalMessages / messageLimit) * 100;

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal mb-2">
              Welcome back to your AI Marketing Team! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Your specialized AI helpers are ready to boost your marketing success.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-sunset-gradient rounded-full flex items-center justify-center">
              <ApperIcon name="Zap" size={48} className="text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Messages Used</p>
              <p className="text-2xl font-bold text-charcoal">{totalMessages}</p>
              <p className="text-xs text-gray-500">of {messageLimit} limit</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageSquare" size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-sunset-gradient h-2 rounded-full transition-all duration-300"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Helpers</p>
              <p className="text-2xl font-bold text-charcoal">8</p>
              <p className="text-xs text-gray-500">All available</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversations</p>
              <p className="text-2xl font-bold text-charcoal">{recentConversations.length}</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageCircle" size={24} className="text-info" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plan</p>
              <p className="text-2xl font-bold text-charcoal">Pro</p>
              <Badge variant="success" size="sm" className="mt-1">
                Active
              </Badge>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Crown" size={24} className="text-warning" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Helpers Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-charcoal">Your AI Helpers</h2>
            <Link to="/app/helpers">
              <Button variant="ghost" size="sm" icon="ArrowRight" iconPosition="right">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpers.slice(0, 4).map((helper, index) => (
              <motion.div
                key={helper.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <HelperCard helper={helper} showUsage={true} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Conversations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-charcoal">Recent Conversations</h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {recentConversations.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentConversations.map((conversation, index) => {
                  const helper = helpers.find(h => h.Id === conversation.helper_id);
                  if (!helper) return null;

                  return (
                    <motion.div
                      key={conversation.Id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link
                        to={`/app/helper/${helper.Id}`}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                            style={{ 
                              background: `linear-gradient(135deg, ${helper.color}20, ${helper.color}10)`,
                              border: `2px solid ${helper.color}30`
                            }}
                          >
                            {helper.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-charcoal truncate">
                              {conversation.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              with {helper.name}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(conversation.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8">
                <Empty
                  type="conversations"
                  onAction={() => window.location.href = '/app/helpers'}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;