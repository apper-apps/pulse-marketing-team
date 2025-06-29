import knowledgeBaseData from '@/services/mockData/knowledgeBase.json';

const STORAGE_KEY = 'aimt_knowledge_base';

let knowledgeBase = [...knowledgeBaseData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const knowledgeBaseService = {
  async getByUserId(userId = 'user-1') {
    await delay(300);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        knowledgeBase = JSON.parse(stored);
      }
      
      let userKB = knowledgeBase.find(kb => kb.user_id === userId);
      
      if (!userKB) {
        // Create default knowledge base for user
        userKB = {
          Id: knowledgeBase.length + 1,
          user_id: userId,
          company_info: {
            company_name: "",
            industry: "",
            target_audience: "",
            brand_voice: "",
            value_proposition: "",
            key_products: [],
            unique_selling_points: [],
            brand_personality: "",
            tone_guidelines: []
          },
          files: [],
          updated_at: new Date().toISOString()
        };
        knowledgeBase.push(userKB);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(knowledgeBase));
      }
      
      return { ...userKB };
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      throw error;
    }
  },

  async updateCompanyInfo(userId = 'user-1', companyInfo) {
    await delay(400);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        knowledgeBase = JSON.parse(stored);
      }
      
      const kbIndex = knowledgeBase.findIndex(kb => kb.user_id === userId);
      
      if (kbIndex === -1) {
        // Create new knowledge base
        const newKB = {
          Id: knowledgeBase.length + 1,
          user_id: userId,
          company_info: companyInfo,
          files: [],
          updated_at: new Date().toISOString()
        };
        knowledgeBase.push(newKB);
      } else {
        knowledgeBase[kbIndex] = {
          ...knowledgeBase[kbIndex],
          company_info: { ...knowledgeBase[kbIndex].company_info, ...companyInfo },
          updated_at: new Date().toISOString()
        };
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(knowledgeBase));
      
      const updatedKB = knowledgeBase.find(kb => kb.user_id === userId);
      return { ...updatedKB };
    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  },

  async addFile(userId = 'user-1', fileData) {
    await delay(500);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        knowledgeBase = JSON.parse(stored);
      }
      
      let kbIndex = knowledgeBase.findIndex(kb => kb.user_id === userId);
      
      if (kbIndex === -1) {
        // Create new knowledge base
        const newKB = {
          Id: knowledgeBase.length + 1,
          user_id: userId,
          company_info: {},
          files: [],
          updated_at: new Date().toISOString()
        };
        knowledgeBase.push(newKB);
        kbIndex = knowledgeBase.length - 1;
      }
      
      const newFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: fileData.name,
        type: fileData.type || 'unknown',
        size: fileData.size || '0 KB',
        uploaded_at: new Date().toISOString(),
        description: fileData.description || ''
      };
      
      knowledgeBase[kbIndex].files.push(newFile);
      knowledgeBase[kbIndex].updated_at = new Date().toISOString();
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(knowledgeBase));
      
      return { ...newFile };
    } catch (error) {
      console.error('Error adding file:', error);
      throw error;
    }
  },

  async deleteFile(userId = 'user-1', fileId) {
    await delay(300);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        knowledgeBase = JSON.parse(stored);
      }
      
      const kbIndex = knowledgeBase.findIndex(kb => kb.user_id === userId);
      
      if (kbIndex === -1) {
        throw new Error('Knowledge base not found');
      }
      
      const initialLength = knowledgeBase[kbIndex].files.length;
      knowledgeBase[kbIndex].files = knowledgeBase[kbIndex].files.filter(file => file.id !== fileId);
      
      if (knowledgeBase[kbIndex].files.length === initialLength) {
        throw new Error('File not found');
      }
      
      knowledgeBase[kbIndex].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(knowledgeBase));
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};