import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const PricingCard = ({ 
  plan, 
  isPopular = false, 
  className = '',
  onSelect 
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(plan);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white rounded-2xl p-8 border-2 shadow-lg ${
        isPopular ? 'border-primary shadow-xl' : 'border-gray-200'
      } ${className}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="gradient" size="md">
            Most Popular
          </Badge>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-charcoal mb-2">
          {plan.name}
        </h3>
        
        <div className="mb-6">
          <span className="text-4xl font-bold text-charcoal">
            ${plan.price}
          </span>
          <span className="text-gray-600 ml-1">/month</span>
        </div>
        
        <p className="text-gray-600 mb-8">
          {plan.description}
        </p>
        
        <div className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <ApperIcon 
                name="Check" 
                size={20} 
                className="text-success mr-3 flex-shrink-0" 
              />
              <span className="text-gray-700 text-left">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button
          variant={isPopular ? 'primary' : 'outline'}
          size="lg"
          className="w-full"
          onClick={handleSelect}
        >
          {plan.buttonText || 'Get Started'}
        </Button>
        
        {plan.note && (
          <p className="text-xs text-gray-500 mt-4">
            {plan.note}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PricingCard;