import { toast } from 'react-toastify';

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
          { field: { Name: "last_used" } }
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
          { field: { Name: "last_used" } }
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
  }
};