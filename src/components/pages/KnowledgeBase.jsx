import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { knowledgeBaseService } from '@/services/api/knowledgeBaseService';

const KnowledgeBase = () => {
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    company_name: '',
    industry: '',
    target_audience: '',
    brand_voice: '',
    value_proposition: '',
    brand_personality: ''
  });

  const loadKnowledgeBase = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await knowledgeBaseService.getByUserId();
      setKnowledgeBase(data);
      setCompanyInfo(data.company_info || {});
    } catch (err) {
      setError('Failed to load knowledge base. Please try again.');
      console.error('Error loading knowledge base:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveCompanyInfo = async () => {
    try {
      setSaving(true);
      const updated = await knowledgeBaseService.updateCompanyInfo('user-1', companyInfo);
      setKnowledgeBase(updated);
      toast.success('Company information saved successfully!');
    } catch (error) {
      console.error('Error saving company info:', error);
      toast.error('Failed to save company information');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    
    try {
      for (const file of files) {
        const fileData = {
          name: file.name,
          type: file.type || 'unknown',
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          description: `Uploaded ${file.type || 'file'}`
        };
        
        await knowledgeBaseService.addFile('user-1', fileData);
      }
      
      // Reload knowledge base to show new files
      await loadKnowledgeBase();
      toast.success(`${files.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await knowledgeBaseService.deleteFile('user-1', fileId);
      await loadKnowledgeBase();
      toast.success('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadKnowledgeBase} />;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          Knowledge Base
        </h1>
        <p className="text-gray-600 text-lg">
          Enhance your AI helpers with company information and context
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-charcoal">
              Company Information
            </h2>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building" size={20} className="text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Company Name"
              name="company_name"
              value={companyInfo.company_name || ''}
              onChange={handleInputChange}
              placeholder="Your company name"
            />

            <Input
              label="Industry"
              name="industry"
              value={companyInfo.industry || ''}
              onChange={handleInputChange}
              placeholder="e.g., Fitness Equipment, Software, Consulting"
            />

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Target Audience
              </label>
              <textarea
                name="target_audience"
                value={companyInfo.target_audience || ''}
                onChange={handleInputChange}
                placeholder="Describe your ideal customers..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Brand Voice & Tone
              </label>
              <textarea
                name="brand_voice"
                value={companyInfo.brand_voice || ''}
                onChange={handleInputChange}
                placeholder="How should your brand communicate? (e.g., Professional, Friendly, Authoritative)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Value Proposition
              </label>
              <textarea
                name="value_proposition"
                value={companyInfo.value_proposition || ''}
                onChange={handleInputChange}
                placeholder="What unique value do you provide to customers?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleSaveCompanyInfo}
              loading={saving}
              icon="Save"
              className="w-full"
            >
              {saving ? 'Saving...' : 'Save Company Information'}
            </Button>
          </div>
        </motion.div>

        {/* File Management */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-charcoal">
              Documents & Files
            </h2>
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" size={20} className="text-secondary" />
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block w-full">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="sr-only"
                disabled={uploading}
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <ApperIcon name="Upload" size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {uploading ? 'Uploading...' : 'Click to upload files'}
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, TXT, PNG, JPG up to 10MB each
                </p>
              </div>
            </label>
          </div>

          {/* File List */}
          <div className="space-y-3">
            {knowledgeBase?.files?.length > 0 ? (
              knowledgeBase.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="File" size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.size} • {new Date(file.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  />
                </div>
              ))
            ) : (
              <Empty
                type="files"
                onAction={() => document.querySelector('input[type="file"]').click()}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-info/10 to-info/5 rounded-2xl p-6 border border-info/20"
      >
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Lightbulb" size={20} className="text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal mb-2">
              Tips for Better AI Assistance
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Upload brand guidelines to maintain consistent voice across all content</li>
              <li>• Include competitor analysis documents for strategic insights</li>
              <li>• Add customer personas and market research for targeted messaging</li>
              <li>• Provide product catalogs and feature lists for accurate descriptions</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KnowledgeBase;