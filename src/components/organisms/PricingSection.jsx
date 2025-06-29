import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PricingCard from '@/components/molecules/PricingCard';

const PricingSection = () => {
  const navigate = useNavigate();
  
  const pricingPlans = [
    {
      name: 'Starter',
      price: 39,
      description: 'Perfect for small businesses getting started with AI marketing',
      features: [
        '3 AI Marketing Helpers',
        '100 messages per month',
        'Basic knowledge base',
        'Email support',
        'Standard response time'
      ],
      buttonText: 'Start Free Trial',
      note: '7-day free trial included'
    },
    {
      name: 'Professional',
      price: 97,
      description: 'Complete marketing team for growing businesses',
      features: [
        'All 8 AI Marketing Helpers',
        '500 messages per month',
        'Advanced knowledge base',
        'File uploads (PDFs, docs)',
        'Priority support',
        'GoHighLevel integration',
        'Export conversations'
      ],
      buttonText: 'Get Started',
      popular: true
    },
    {
      name: 'Agency',
      price: 197,
      description: 'Full-scale solution for agencies and enterprises',
      features: [
        'Everything in Professional',
        'Unlimited messages',
        'White-label option',
        'Multiple team members',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager'
      ],
      buttonText: 'Contact Sales'
    }
  ];

  const handlePlanSelect = (plan) => {
    toast.success(`${plan.name} plan selected! Redirecting to registration...`);
    setTimeout(() => {
      navigate('/register', { state: { selectedPlan: plan.name } });
    }, 1000);
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-charcoal mb-4"
          >
            Choose Your Marketing Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Affordable AI marketing expertise that scales with your business. 
            Start free and upgrade as you grow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PricingCard
                plan={plan}
                isPopular={plan.popular}
                onSelect={handlePlanSelect}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500 mb-4">
            All plans include secure data handling, regular updates, and 24/7 AI availability
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day money back guarantee</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;