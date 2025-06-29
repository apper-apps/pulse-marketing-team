import conversationsData from '@/services/mockData/conversations.json';

const STORAGE_KEY = 'aimt_conversations';

let conversations = [...conversationsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const conversationsService = {
  async getAll(userId = 'user-1') {
    await delay(300);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        conversations = JSON.parse(stored);
      }
      return conversations.filter(conv => conv.user_id === userId);
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        conversations = JSON.parse(stored);
      }
      const conversation = conversations.find(conv => conv.Id === parseInt(id));
      if (!conversation) {
        throw new Error(`Conversation with Id ${id} not found`);
      }
      return { ...conversation };
    } catch (error) {
      console.error('Error loading conversation:', error);
      throw error;
    }
  },

  async getByHelper(helperId, userId = 'user-1') {
    await delay(250);
    try {
      const allConversations = await this.getAll(userId);
      return allConversations.filter(conv => conv.helper_id === parseInt(helperId));
    } catch (error) {
      console.error('Error loading helper conversations:', error);
      return [];
    }
  },

  async create(conversationData) {
    await delay(300);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        conversations = JSON.parse(stored);
      }
      
      const maxId = conversations.length > 0 ? Math.max(...conversations.map(c => c.Id)) : 0;
      const newConversation = {
        Id: maxId + 1,
        user_id: conversationData.user_id || 'user-1',
        helper_id: parseInt(conversationData.helper_id),
        title: conversationData.title || 'New Conversation',
        messages: conversationData.messages || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      conversations.push(newConversation);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      
      return { ...newConversation };
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  async addMessage(conversationId, message) {
    await delay(200);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        conversations = JSON.parse(stored);
      }
      
      const conversationIndex = conversations.findIndex(conv => conv.Id === parseInt(conversationId));
      if (conversationIndex === -1) {
        throw new Error(`Conversation with Id ${conversationId} not found`);
      }
      
      const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newMessage = {
        id: messageId,
        role: message.role,
        content: message.content,
        timestamp: new Date().toISOString()
      };
      
      conversations[conversationIndex].messages.push(newMessage);
      conversations[conversationIndex].updated_at = new Date().toISOString();
      
      // Update title if it's the first user message
      if (message.role === 'user' && conversations[conversationIndex].messages.length <= 2) {
        conversations[conversationIndex].title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      
      return { ...conversations[conversationIndex] };
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  async delete(id) {
    await delay(200);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        conversations = JSON.parse(stored);
      }
      
      const initialLength = conversations.length;
      conversations = conversations.filter(conv => conv.Id !== parseInt(id));
      
      if (conversations.length === initialLength) {
        throw new Error(`Conversation with Id ${id} not found`);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
};