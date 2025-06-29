import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ isLanding = false }) => {
  if (isLanding) {
    return (
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-sunset-gradient rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-charcoal">
                AI Marketing Team
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">
                About
              </a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-charcoal">
            AI Marketing Team
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Usage indicator */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="MessageSquare" size={16} />
            <span>47/500 messages</span>
          </div>
          
          {/* User menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sunset-gradient rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-charcoal">
              Demo User
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;