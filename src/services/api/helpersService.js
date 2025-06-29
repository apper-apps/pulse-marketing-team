import { toast } from "react-toastify";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const helpersService = {
  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "specialty" } },
          { field: { Name: "description" } },
          { field: { Name: "avatar" } },
          { field: { Name: "personality" } },
          { field: { Name: "color" } },
          { field: { Name: "specialties" } },
          { field: { Name: "greeting" } },
          { field: { Name: "quick_actions" } },
          { field: { Name: "usage_count" } },
          { field: { Name: "last_used" } },
          { field: { Name: "trainingInstructions" } },
          { field: { Name: "trainingKnowledge" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('helper', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error loading helpers:', error);
      toast.error('Failed to load helpers');
      return [];
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "specialty" } },
          { field: { Name: "description" } },
          { field: { Name: "avatar" } },
          { field: { Name: "personality" } },
          { field: { Name: "color" } },
          { field: { Name: "specialties" } },
          { field: { Name: "greeting" } },
          { field: { Name: "quick_actions" } },
          { field: { Name: "usage_count" } },
          { field: { Name: "last_used" } },
          { field: { Name: "trainingInstructions" } },
          { field: { Name: "trainingKnowledge" } }
        ]
      };

      const response = await apperClient.getRecordById('helper', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(`Helper with Id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error('Error loading helper:', error);
      throw error;
    }
  },

  async updateUsageStats(helperId, messageCount = 1) {
    await delay(100);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: parseInt(helperId),
            usage_count: messageCount,
            last_used: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.updateRecord('helper', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(`Helper with Id ${helperId} not found`);
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        const successfulUpdates = response.results.filter(result => result.success);
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      throw new Error(`Helper with Id ${helperId} not found`);
} catch (error) {
      console.error('Error updating usage stats:', error);
      throw error;
    }
  },

async getOrCreateHelperKnowledgeBase(helperId) {
  await delay(300);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // First try to get existing knowledge base for this helper
    const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } },
          { field: { Name: "company_name" } },
          { field: { Name: "industry" } },
          { field: { Name: "target_audience" } },
          { field: { Name: "brand_voice" } },
          { field: { Name: "value_proposition" } },
          { field: { Name: "key_products" } },
          { field: { Name: "unique_selling_points" } },
          { field: { Name: "brand_personality" } },
          { field: { Name: "tone_guidelines" } },
          { field: { Name: "files" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "trainingInstructions" } },
          { field: { Name: "trainingKnowledge" } }
        ],
      where: [
        { FieldName: "user_id", Operator: "EqualTo", Values: [`helper-${helperId}`] }
      ]
    };

    const response = await apperClient.fetchRecords('knowledge_base', params);

    if (!response.success) {
      console.error(response.message);
      // Create default knowledge base if fetch fails
      return await this.createDefaultHelperKnowledgeBase(helperId);
    }

    if (!response.data || response.data.length === 0) {
      // No existing knowledge base, create default one
      return await this.createDefaultHelperKnowledgeBase(helperId);
    }

    // Return existing knowledge base
    const helperKB = response.data[0];
    return {
      ...helperKB,
      company_info: {
        company_name: helperKB.company_name || "",
        industry: helperKB.industry || "",
        target_audience: helperKB.target_audience || "",
        brand_voice: helperKB.brand_voice || "",
        value_proposition: helperKB.value_proposition || "",
        key_products: helperKB.key_products || "",
        unique_selling_points: helperKB.unique_selling_points || "",
        brand_personality: helperKB.brand_personality || "",
        tone_guidelines: helperKB.tone_guidelines || ""
      },
      files: helperKB.files ? JSON.parse(helperKB.files) : []
    };
  } catch (error) {
    console.error('Error getting helper knowledge base:', error);
    return await this.createDefaultHelperKnowledgeBase(helperId);
  }
},

async updateHelperKnowledgeBase(helperId, knowledgeInfo) {
  await delay(400);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Get existing knowledge base
    const existingKB = await this.getOrCreateHelperKnowledgeBase(helperId);
    
    const params = {
      records: [
        {
          Id: existingKB.Id,
          company_name: knowledgeInfo.company_name || existingKB.company_name || "",
          industry: knowledgeInfo.industry || existingKB.industry || "",
          target_audience: knowledgeInfo.target_audience || existingKB.target_audience || "",
          brand_voice: knowledgeInfo.brand_voice || existingKB.brand_voice || "",
          value_proposition: knowledgeInfo.value_proposition || existingKB.value_proposition || "",
          brand_personality: knowledgeInfo.brand_personality || existingKB.brand_personality || "",
          tone_guidelines: knowledgeInfo.tone_guidelines || existingKB.tone_guidelines || "",
          updated_at: new Date().toISOString()
        }
      ]
    };

    const response = await apperClient.updateRecord('knowledge_base', params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      throw new Error('Failed to update helper knowledge base');
    }

    if (response.results) {
      const failedUpdates = response.results.filter(result => !result.success);
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        failedUpdates.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        throw new Error('Failed to update helper knowledge base');
      }
    }

    return await this.getOrCreateHelperKnowledgeBase(helperId);
  } catch (error) {
    console.error('Error updating helper knowledge base:', error);
    throw error;
  }
},

async getHelperKnowledgeBase(helperId) {
  await delay(200);
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } },
          { field: { Name: "company_name" } },
          { field: { Name: "industry" } },
          { field: { Name: "target_audience" } },
          { field: { Name: "brand_voice" } },
          { field: { Name: "value_proposition" } },
          { field: { Name: "key_products" } },
          { field: { Name: "unique_selling_points" } },
          { field: { Name: "brand_personality" } },
          { field: { Name: "tone_guidelines" } },
          { field: { Name: "files" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "trainingInstructions" } },
          { field: { Name: "trainingKnowledge" } }
        ],
      where: [
        { FieldName: "user_id", Operator: "EqualTo", Values: [`helper-${helperId}`] }
      ]
    };

    const response = await apperClient.fetchRecords('knowledge_base', params);

    if (!response.success || !response.data || response.data.length === 0) {
      return null;
    }

    const helperKB = response.data[0];
    return {
      ...helperKB,
      company_info: {
        company_name: helperKB.company_name || "",
        industry: helperKB.industry || "",
        target_audience: helperKB.target_audience || "",
        brand_voice: helperKB.brand_voice || "",
        value_proposition: helperKB.value_proposition || "",
        key_products: helperKB.key_products || "",
        unique_selling_points: helperKB.unique_selling_points || "",
        brand_personality: helperKB.brand_personality || "",
        tone_guidelines: helperKB.tone_guidelines || ""
      },
      files: helperKB.files ? JSON.parse(helperKB.files) : []
    };
  } catch (error) {
    console.error('Error getting helper knowledge base:', error);
    return null;
  }
},

async createDefaultHelperKnowledgeBase(helperId) {
  try {
    // Get helper details to create specialized knowledge base
    const helper = await this.getById(helperId);
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Create specialized default content based on helper specialty
    const defaultContent = this.getDefaultContentForHelper(helper);

    const params = {
      records: [
        {
          Name: `${helper.Name} Knowledge Base`,
          user_id: `helper-${helperId}`,
          company_name: "",
          industry: defaultContent.industry,
          target_audience: defaultContent.target_audience,
          brand_voice: defaultContent.brand_voice,
          value_proposition: defaultContent.value_proposition,
          key_products: defaultContent.key_products,
          unique_selling_points: defaultContent.unique_selling_points,
          brand_personality: helper.personality || "professional",
          tone_guidelines: defaultContent.tone_guidelines,
          files: JSON.stringify([]),
          updated_at: new Date().toISOString()
        }
      ]
    };

    const response = await apperClient.createRecord('knowledge_base', params);

    if (!response.success) {
      console.error(response.message);
      // Return default structure even if creation fails
      return {
        Id: null,
        Name: `${helper.Name} Knowledge Base`,
        user_id: `helper-${helperId}`,
        company_info: {
          company_name: "",
          industry: defaultContent.industry,
          target_audience: defaultContent.target_audience,
          brand_voice: defaultContent.brand_voice,
          value_proposition: defaultContent.value_proposition,
          key_products: defaultContent.key_products,
          unique_selling_points: defaultContent.unique_selling_points,
          brand_personality: helper.personality || "professional",
          tone_guidelines: defaultContent.tone_guidelines
        },
        files: [],
        updated_at: new Date().toISOString()
      };
    }

    if (response.results && response.results.length > 0 && response.results[0].success) {
      const newKB = response.results[0].data;
      return {
        ...newKB,
        company_info: {
          company_name: "",
          industry: defaultContent.industry,
          target_audience: defaultContent.target_audience,
          brand_voice: defaultContent.brand_voice,
          value_proposition: defaultContent.value_proposition,
          key_products: defaultContent.key_products,
          unique_selling_points: defaultContent.unique_selling_points,
          brand_personality: helper.personality || "professional",
          tone_guidelines: defaultContent.tone_guidelines
        },
        files: []
      };
    }

    throw new Error('Failed to create default helper knowledge base');
  } catch (error) {
    console.error('Error creating default helper knowledge base:', error);
    return {
      Id: null,
      Name: `Helper ${helperId} Knowledge Base`,
      user_id: `helper-${helperId}`,
      company_info: {
        company_name: "",
        industry: "",
        target_audience: "",
        brand_voice: "",
        value_proposition: "",
        key_products: "",
        unique_selling_points: "",
        brand_personality: "professional",
        tone_guidelines: ""
      },
      files: [],
      updated_at: new Date().toISOString()
    };
  }
},

getDefaultContentForHelper(helper) {
  const specialty = helper.specialty?.toLowerCase() || '';
  
  const specialtyDefaults = {
    'marketing strategy': {
      industry: 'Marketing & Strategy',
      target_audience: 'Business owners, marketing managers, and growth teams looking for strategic marketing guidance',
      brand_voice: 'Strategic, analytical, results-focused with clear actionable insights',
      value_proposition: 'Expert marketing strategy guidance to drive sustainable business growth',
      key_products: 'Campaign planning, competitive analysis, market research, growth strategies',
      unique_selling_points: 'Data-driven insights, proven frameworks, strategic thinking, measurable results',
      tone_guidelines: 'Professional yet approachable, focus on ROI and business impact, use data to support recommendations'
    },
    'social media': {
      industry: 'Social Media & Content',
      target_audience: 'Content creators, social media managers, and brands seeking engaging social presence',
      brand_voice: 'Creative, trendy, engaging with current social media best practices',
      value_proposition: 'Expert social media guidance to build authentic engagement and brand awareness',
      key_products: 'Content calendars, social strategy, engagement tactics, platform optimization',
      unique_selling_points: 'Platform expertise, trend awareness, engagement optimization, visual storytelling',
      tone_guidelines: 'Casual and creative, use current social media language, focus on engagement and authenticity'
    },
    'content creation': {
      industry: 'Content & Copywriting',
      target_audience: 'Content creators, marketers, and business owners needing high-quality written content',
      brand_voice: 'Creative, articulate, versatile with strong writing expertise',
      value_proposition: 'Professional content creation that resonates with audiences and drives action',
      key_products: 'Blog posts, web copy, email content, product descriptions, content strategy',
      unique_selling_points: 'Versatile writing styles, SEO optimization, audience targeting, compelling storytelling',
      tone_guidelines: 'Adapt tone to audience needs, focus on clarity and engagement, maintain brand consistency'
    },
    'email marketing': {
      industry: 'Email Marketing & Automation',
      target_audience: 'Marketers, business owners, and teams focused on email marketing and customer nurturing',
      brand_voice: 'Nurturing, relationship-focused, conversion-oriented with personal touch',
      value_proposition: 'Email marketing expertise that builds relationships and drives consistent revenue',
      key_products: 'Email campaigns, automation sequences, list management, A/B testing',
      unique_selling_points: 'Deliverability expertise, segmentation strategies, automation workflows, performance optimization',
      tone_guidelines: 'Personal and conversational, focus on relationship building, emphasize value and trust'
    },
    'advertising': {
      industry: 'Digital Advertising & PPC',
      target_audience: 'Marketing teams, business owners, and advertisers seeking profitable paid campaigns',
      brand_voice: 'Results-driven, data-focused, optimization-minded with ROI emphasis',
      value_proposition: 'Expert advertising guidance for profitable campaigns and optimal ad spend',
      key_products: 'Google Ads, Facebook Ads, ad copy creation, campaign optimization, keyword research',
      unique_selling_points: 'Platform expertise, bid optimization, audience targeting, conversion tracking',
      tone_guidelines: 'Direct and results-focused, use performance metrics, emphasize ROI and conversions'
    },
    'analytics': {
      industry: 'Data Analytics & Insights',
      target_audience: 'Data analysts, marketers, and business leaders seeking data-driven insights',
      brand_voice: 'Analytical, precise, insightful with data-driven recommendations',
      value_proposition: 'Expert data analysis that transforms numbers into actionable business insights',
      key_products: 'Performance tracking, ROI analysis, data visualization, insights generation',
      unique_selling_points: 'Statistical expertise, visualization skills, actionable insights, trend identification',
      tone_guidelines: 'Analytical and precise, support claims with data, focus on actionable insights'
    }
  };

  return specialtyDefaults[specialty] || {
    industry: 'Business Consulting',
    target_audience: 'Business professionals seeking expert guidance and strategic advice',
    brand_voice: 'Professional, knowledgeable, supportive with practical insights',
    value_proposition: 'Expert guidance to help achieve business goals and overcome challenges',
    key_products: 'Strategic advice, problem-solving, best practices, industry insights',
unique_selling_points: 'Expert knowledge, practical experience, tailored solutions, proven methods',
    tone_guidelines: 'Professional and supportive, focus on practical solutions, provide clear guidance'
  };
}

};