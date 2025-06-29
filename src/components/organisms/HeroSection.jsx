import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-background to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-charcoal mb-6">
              Meet Your{' '}
              <span className="bg-sunset-gradient bg-clip-text text-transparent">
                AI Marketing Team
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            8 Specialized AI Helpers for Marketing Growth. From strategy to execution, 
            get expert marketing assistance that scales with your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/register">
              <Button variant="primary" size="xl" icon="ArrowRight" iconPosition="right">
                Get Started Free
              </Button>
            </Link>
            
            <a href="#features">
              <Button variant="ghost" size="xl" icon="PlayCircle" iconPosition="left">
                See How It Works
              </Button>
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center">
              <ApperIcon name="Shield" size={16} className="mr-2 text-success" />
              Secure & Private
            </div>
            <div className="flex items-center">
              <ApperIcon name="Zap" size={16} className="mr-2 text-warning" />
              Instant Results
            </div>
            <div className="flex items-center">
              <ApperIcon name="Users" size={16} className="mr-2 text-info" />
              8 Expert Helpers
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;