import helpersData from '@/services/mockData/helpers.json';

const STORAGE_KEY = 'aimt_helpers';

let helpers = [...helpersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const helpersService = {
  async getAll() {
    await delay(300);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        helpers = JSON.parse(stored);
      }
      return [...helpers];
    } catch (error) {
      console.error('Error loading helpers:', error);
      return [...helpersData];
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const helpers = await this.getAll();
      const helper = helpers.find(h => h.Id === parseInt(id));
      if (!helper) {
        throw new Error(`Helper with Id ${id} not found`);
      }
      return { ...helper };
    } catch (error) {
      console.error('Error loading helper:', error);
      throw error;
    }
  },

  async updateUsageStats(helperId, messageCount = 1) {
    await delay(100);
    try {
      const helpers = await this.getAll();
      const helperIndex = helpers.findIndex(h => h.Id === parseInt(helperId));
      
      if (helperIndex !== -1) {
        helpers[helperIndex] = {
          ...helpers[helperIndex],
          usage_count: (helpers[helperIndex].usage_count || 0) + messageCount,
          last_used: new Date().toISOString()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(helpers));
        return { ...helpers[helperIndex] };
      }
      
      throw new Error(`Helper with Id ${helperId} not found`);
    } catch (error) {
      console.error('Error updating usage stats:', error);
      throw error;
    }
  }
};