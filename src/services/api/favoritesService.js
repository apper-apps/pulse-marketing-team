// ApperClient service for favorites functionality
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all favorites for the current user
export const getUserFavorites = async () => {
  try {
    await delay(300);
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        {
          field: {
            Name: "user_id"
          }
        },
        {
          field: {
            Name: "helper_id"
          }
        },
        {
          field: {
            Name: "created_at"
          }
        }
      ],
      orderBy: [
        {
          fieldName: "created_at",
          sorttype: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords('favorite', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }
};

// Add a helper to favorites
export const addFavorite = async (helperId) => {
  try {
    await delay(250);
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [
        {
          // Only include Updateable fields
          helper_id: helperId,
          created_at: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.createRecord('favorite', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} favorite records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to add favorite');
      }
      
      const successfulRecords = response.results.filter(result => result.success);
      return successfulRecords[0]?.data || null;
    }
    
    return null;
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

// Remove a helper from favorites
export const removeFavorite = async (helperId) => {
  try {
    await delay(250);
    
    // First, find the favorite record to delete
    const favorites = await getUserFavorites();
    const favoriteRecord = favorites.find(fav => fav.helper_id === helperId);
    
    if (!favoriteRecord) {
      throw new Error('Favorite record not found');
    }
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [favoriteRecord.Id]
    };
    
    const response = await apperClient.deleteRecord('favorite', params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} favorite records:${JSON.stringify(failedDeletions)}`);
        throw new Error('Failed to remove favorite');
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

// Check if a helper is favorited
export const checkIsFavorited = async (helperId) => {
  try {
    const favorites = await getUserFavorites();
    return favorites.some(fav => fav.helper_id === helperId);
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

export const favoritesService = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  checkIsFavorited
};