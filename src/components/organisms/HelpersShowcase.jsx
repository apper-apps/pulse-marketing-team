import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import HelperCard from "@/components/molecules/HelperCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/ui/Button";
import { helpersService } from "@/services/api/helpersService";

const HelpersShowcase = () => {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHelpers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await helpersService.getAll();
      setHelpers(data);
    } catch (err) {
      setError('Failed to load helpers. Please try again.');
      console.error('Error loading helpers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHelpers();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadHelpers} />;

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-charcoal mb-4"
          >
            Your Complete AI Marketing Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Each AI helper brings specialized expertise to help you dominate your marketing goals.
            No more juggling multiple tools or hiring expensive agencies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {helpers.map((helper, index) => (
            <motion.div
              key={helper.Id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <HelperCard helper={helper} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Ready to transform your marketing with AI?
          </p>
          <a href="#pricing">
            <Button variant="primary" size="lg" icon="ArrowRight" iconPosition="right">
              View Pricing Plans
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HelpersShowcase;