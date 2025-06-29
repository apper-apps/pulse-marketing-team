import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import PricingCard from '@/components/molecules/PricingCard';
import ApperIcon from '@/components/ApperIcon';

const Billing = () => {
  const [loading, setLoading] = useState(false);
  
  const currentPlan = {
    name: 'Professional',
    price: 97,
    billing_cycle: 'monthly',
    next_billing_date: '2024-02-15',
    status: 'active'
  };

  const pricingPlans = [
    {
      name: 'Starter',
      price: 39,
      description: 'Perfect for small businesses getting started',
      features: [
        '3 AI Marketing Helpers',
        '100 messages per month',
        'Basic knowledge base',
        'Email support'
      ],
      buttonText: 'Downgrade to Starter'
    },
    {
      name: 'Professional',
      price: 97,
      description: 'Complete marketing team for growing businesses',
      features: [
        'All 8 AI Marketing Helpers',
        '500 messages per month',
        'Advanced knowledge base',
        'File uploads',
        'Priority support',
        'GoHighLevel integration'
      ],
      buttonText: 'Current Plan',
      popular: true
    },
    {
      name: 'Agency',
      price: 197,
      description: 'Full-scale solution for agencies',
      features: [
        'Everything in Professional',
        'Unlimited messages',
        'White-label option',
        'Multiple team members',
        'Advanced analytics',
        'Dedicated support'
      ],
      buttonText: 'Upgrade to Agency'
    }
  ];

  const invoiceHistory = [
    {
      id: 'inv-001',
      date: '2024-01-15',
      amount: 97,
      status: 'paid',
      plan: 'Professional',
      period: 'Jan 15 - Feb 15, 2024'
    },
    {
      id: 'inv-002',
      date: '2023-12-15',
      amount: 97,
      status: 'paid',
      plan: 'Professional',
      period: 'Dec 15, 2023 - Jan 15, 2024'
    },
    {
      id: 'inv-003',
      date: '2023-11-15',
      amount: 97,
      status: 'paid',
      plan: 'Professional',
      period: 'Nov 15 - Dec 15, 2023'
    }
  ];

  const handlePlanChange = async (plan) => {
    if (plan.name === currentPlan.name) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Successfully ${plan.price > currentPlan.price ? 'upgraded' : 'downgraded'} to ${plan.name} plan!`);
    } catch (error) {
      toast.error('Failed to update plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (invoiceId) => {
    toast.success(`Downloading invoice ${invoiceId}...`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          Billing & Subscription
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your subscription and billing information
        </p>
      </motion.div>

      {/* Current Plan Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-charcoal">
                {currentPlan.name} Plan
              </h2>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-gray-600 mb-4">
              ${currentPlan.price}/month • Next billing: {new Date(currentPlan.next_billing_date).toLocaleDateString()}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <ApperIcon name="MessageSquare" size={16} className="mr-2 text-primary" />
                47/500 messages used
              </div>
              <div className="flex items-center">
                <ApperIcon name="Users" size={16} className="mr-2 text-primary" />
                8 helpers available
              </div>
              <div className="flex items-center">
                <ApperIcon name="Database" size={16} className="mr-2 text-primary" />
                Unlimited files
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" icon="CreditCard">
              Update Payment Method
            </Button>
            <Button variant="ghost" icon="Download">
              Download Invoice
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">Messages</h3>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageSquare" size={20} className="text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-2xl font-bold text-charcoal">47</span>
              <span className="text-sm text-gray-500">of 500</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-sunset-gradient h-2 rounded-full" style={{ width: '9.4%' }}></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">Helpers Used</h3>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-success" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-2xl font-bold text-charcoal">6</span>
              <span className="text-sm text-gray-500">of 8</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">Files Uploaded</h3>
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" size={20} className="text-info" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-2xl font-bold text-charcoal">3</span>
              <span className="text-sm text-gray-500">unlimited</span>
            </div>
            <p className="text-xs text-gray-500">Brand guidelines, product catalog, competitor analysis</p>
          </div>
        </motion.div>
      </div>

      {/* Pricing Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-charcoal text-center">
          Change Your Plan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <PricingCard
                plan={plan}
                isPopular={plan.popular}
                onSelect={handlePlanChange}
                className={plan.name === currentPlan.name ? 'ring-2 ring-primary' : ''}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Invoice History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-charcoal">
            Invoice History
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {invoiceHistory.map((invoice) => (
            <div key={invoice.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-charcoal">
                    {invoice.plan} Plan
                  </p>
                  <p className="text-sm text-gray-600">
                    {invoice.period}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold text-charcoal">
                    ${invoice.amount}
                  </p>
                  <div className="flex items-center">
                    <Badge 
                      variant={invoice.status === 'paid' ? 'success' : 'warning'} 
                      size="sm"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Download"
                  onClick={() => handleDownloadInvoice(invoice.id)}
                >
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Billing;