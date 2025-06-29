import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const conversationsService = {
  async getAll(userId = 'user-1') {
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
          { field: { Name: "title" } },
          { field: { Name: "messages" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "helper_id" } }
        ],
        where: [
          { FieldName: "user_id", Operator: "EqualTo", Values: [userId] }
        ],
        orderBy: [
          { fieldName: "updated_at", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('conversation', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error loading conversations:', error);
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
          { field: { Name: "user_id" } },
          { field: { Name: "title" } },
          { field: { Name: "messages" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "helper_id" } }
        ]
      };

      const response = await apperClient.getRecordById('conversation', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(`Conversation with Id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error('Error loading conversation:', error);
      throw error;
    }
  },

  async getByHelper(helperId, userId = 'user-1') {
    await delay(250);
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
          { field: { Name: "title" } },
          { field: { Name: "messages" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "helper_id" } }
        ],
        where: [
          { FieldName: "helper_id", Operator: "EqualTo", Values: [parseInt(helperId)] },
          { FieldName: "user_id", Operator: "EqualTo", Values: [userId] }
        ],
        orderBy: [
          { fieldName: "updated_at", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('conversation', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error loading helper conversations:', error);
      return [];
    }
  },

  async create(conversationData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            user_id: conversationData.user_id || 'user-1',
            helper_id: parseInt(conversationData.helper_id),
            title: conversationData.title || 'New Conversation',
            messages: JSON.stringify(conversationData.messages || []),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.createRecord('conversation', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create conversation');
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create conversation');
        }

        const successfulRecords = response.results.filter(result => result.success);
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create conversation');
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  async addMessage(conversationId, message) {
    await delay(200);
    try {
      // First get the current conversation
      const conversation = await this.getById(conversationId);
      const currentMessages = conversation.messages ? JSON.parse(conversation.messages) : [];
      
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newMessage = {
        id: messageId,
        role: message.role,
        content: message.content,
        timestamp: new Date().toISOString()
      };
      
      currentMessages.push(newMessage);
      
      // Update title if it's the first user message
      let newTitle = conversation.title;
      if (message.role === 'user' && currentMessages.length <= 2) {
        newTitle = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: parseInt(conversationId),
            title: newTitle,
            messages: JSON.stringify(currentMessages),
            updated_at: new Date().toISOString()
          }
        ]
      };

      const response = await apperClient.updateRecord('conversation', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to add message');
      }

      return await this.getById(conversationId);
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  async delete(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('conversation', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
};