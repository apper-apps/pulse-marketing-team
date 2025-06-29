import React from 'react';
import Header from '@/components/organisms/Header';
import HeroSection from '@/components/organisms/HeroSection';
import HelpersShowcase from '@/components/organisms/HelpersShowcase';
import PricingSection from '@/components/organisms/PricingSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isLanding={true} />
      <HeroSection />
      <HelpersShowcase />
      <PricingSection />
      
      {/* Footer */}
      <footer className="bg-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-sunset-gradient rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⚡</span>
              </div>
              <span className="text-xl font-bold">AI Marketing Team</span>
            </div>
            <p className="text-gray-400 mb-8">
              Your complete AI-powered marketing department
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <span>© 2024 AI Marketing Team</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;