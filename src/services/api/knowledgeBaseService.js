import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const knowledgeBaseService = {
  async getByUserId(userId = 'user-1') {
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
          { field: { Name: "updated_at" } }
        ],
        where: [
          { FieldName: "user_id", Operator: "EqualTo", Values: [userId] }
        ]
      };

      const response = await apperClient.fetchRecords('knowledge_base', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return this.createDefaultKnowledgeBase(userId);
      }

      if (!response.data || response.data.length === 0) {
        return this.createDefaultKnowledgeBase(userId);
      }

      const userKB = response.data[0];
      return {
        ...userKB,
        company_info: {
          company_name: userKB.company_name || "",
          industry: userKB.industry || "",
          target_audience: userKB.target_audience || "",
          brand_voice: userKB.brand_voice || "",
          value_proposition: userKB.value_proposition || "",
          key_products: userKB.key_products || "",
          unique_selling_points: userKB.unique_selling_points || "",
          brand_personality: userKB.brand_personality || "",
          tone_guidelines: userKB.tone_guidelines || ""
        },
        files: userKB.files ? JSON.parse(userKB.files) : []
      };
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      return this.createDefaultKnowledgeBase(userId);
    }
  },

  async createDefaultKnowledgeBase(userId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            user_id: userId,
            company_name: "",
            industry: "",
            target_audience: "",
            brand_voice: "",
            value_proposition: "",
            key_products: "",
            unique_selling_points: "",
            brand_personality: "",
            tone_guidelines: "",
            files: JSON.stringify([]),
            updated_at: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.createRecord('knowledge_base', params);

      if (!response.success) {
        console.error(response.message);
        return {
          Id: null,
          user_id: userId,
          company_info: {
            company_name: "",
            industry: "",
            target_audience: "",
            brand_voice: "",
            value_proposition: "",
            key_products: "",
            unique_selling_points: "",
            brand_personality: "",
            tone_guidelines: ""
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
            industry: "",
            target_audience: "",
            brand_voice: "",
            value_proposition: "",
            key_products: "",
            unique_selling_points: "",
            brand_personality: "",
            tone_guidelines: ""
          },
          files: []
        };
      }

      throw new Error('Failed to create default knowledge base');
    } catch (error) {
      console.error('Error creating default knowledge base:', error);
      return {
        Id: null,
        user_id: userId,
        company_info: {
          company_name: "",
          industry: "",
          target_audience: "",
          brand_voice: "",
          value_proposition: "",
          key_products: "",
          unique_selling_points: "",
          brand_personality: "",
          tone_guidelines: ""
        },
        files: [],
        updated_at: new Date().toISOString()
      };
    }
  },

  async updateCompanyInfo(userId = 'user-1', companyInfo) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First get the existing knowledge base
      const existingKB = await this.getByUserId(userId);
      
      const params = {
        records: [
          {
            Id: existingKB.Id,
            company_name: companyInfo.company_name || "",
            industry: companyInfo.industry || "",
            target_audience: companyInfo.target_audience || "",
            brand_voice: companyInfo.brand_voice || "",
            value_proposition: companyInfo.value_proposition || "",
            brand_personality: companyInfo.brand_personality || "",
            updated_at: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.updateRecord('knowledge_base', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update company info');
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update company info');
        }
      }

      return await this.getByUserId(userId);
    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  },

  async addFile(userId = 'user-1', fileData) {
    await delay(500);
    try {
      // Get existing knowledge base
      const existingKB = await this.getByUserId(userId);
      const currentFiles = existingKB.files || [];
      
      const newFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: fileData.name,
        type: fileData.type || 'unknown',
        size: fileData.size || '0 KB',
        uploaded_at: new Date().toISOString(),
        description: fileData.description || ''
      };
      
      currentFiles.push(newFile);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: existingKB.Id,
            files: JSON.stringify(currentFiles),
            updated_at: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.updateRecord('knowledge_base', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to add file');
      }

      return newFile;
    } catch (error) {
      console.error('Error adding file:', error);
      throw error;
    }
  },

  async deleteFile(userId = 'user-1', fileId) {
    await delay(300);
    try {
      // Get existing knowledge base
      const existingKB = await this.getByUserId(userId);
      const currentFiles = existingKB.files || [];
      
      const initialLength = currentFiles.length;
      const updatedFiles = currentFiles.filter(file => file.id !== fileId);
      
      if (updatedFiles.length === initialLength) {
        throw new Error('File not found');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: existingKB.Id,
            files: JSON.stringify(updatedFiles),
            updated_at: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.updateRecord('knowledge_base', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to delete file');
      }

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};