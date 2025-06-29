import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import HelperCard from '@/components/molecules/HelperCard';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { helpersService } from '@/services/api/helpersService';
import { favoritesService } from '@/services/api/favoritesService';

const MyAIHelpers = () => {
  const [helpers, setHelpers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteLoading, setFavoriteLoading] = useState({});

  const loadHelpersAndFavorites = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [helpersData, favoritesData] = await Promise.all([
        helpersService.getAll(),
        favoritesService.getUserFavorites()
      ]);
      
      setHelpers(helpersData);
      setFavorites(favoritesData);
    } catch (err) {
      setError('Failed to load helpers. Please try again.');
      console.error('Error loading helpers and favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHelpersAndFavorites();
  }, []);

  const handleToggleFavorite = async (helperId) => {
    const isFavorited = favorites.some(fav => fav.helper_id === helperId);
    
    // Optimistic update
    setFavoriteLoading(prev => ({ ...prev, [helperId]: true }));
    
    try {
      if (isFavorited) {
        // Remove from favorites
        await favoritesService.removeFavorite(helperId);
        setFavorites(prev => prev.filter(fav => fav.helper_id !== helperId));
        toast.success('Helper removed from favorites');
      } else {
        // Add to favorites
        const newFavorite = await favoritesService.addFavorite(helperId);
        if (newFavorite) {
          setFavorites(prev => [...prev, newFavorite]);
        }
        toast.success('Helper added to favorites');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('Failed to update favorite. Please try again.');
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [helperId]: false }));
    }
  };

  // Filter helpers based on search term
  const filteredHelpers = helpers.filter(helper =>
    helper.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    helper.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    helper.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate favorites and non-favorites
  const favoriteHelpers = filteredHelpers.filter(helper =>
    favorites.some(fav => fav.helper_id === helper.Id)
  );
  
  const nonFavoriteHelpers = filteredHelpers.filter(helper =>
    !favorites.some(fav => fav.helper_id === helper.Id)
  );

  // Combine with favorites first
  const sortedHelpers = [...favoriteHelpers, ...nonFavoriteHelpers];

  if (loading) return <Loading type="helpers" />;
  if (error) return <Error message={error} onRetry={loadHelpersAndFavorites} />;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            My AI Helpers
          </h1>
          <p className="text-gray-600">
            Chat with your specialized AI marketing team. ⭐ Mark favorites to pin them to the top!
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="Users" size={16} />
          <span>{helpers.length} helpers available</span>
          {favorites.length > 0 && (
            <>
              <span>•</span>
              <ApperIcon name="Heart" size={16} className="text-red-500" />
              <span>{favorites.length} favorited</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar
          placeholder="Search helpers by name, specialty, or description..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="max-w-md"
        />
      </motion.div>

      {/* Helpers Grid */}
      {sortedHelpers.length > 0 ? (
        <div className="space-y-8">
          {/* Favorites Section */}
          {favoriteHelpers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <ApperIcon name="Heart" size={20} className="text-red-500" />
                <h2 className="text-xl font-semibold text-charcoal">
                  Favorite Helpers ({favoriteHelpers.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteHelpers.map((helper, index) => (
                  <motion.div
                    key={helper.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <HelperCard
                      helper={helper}
                      showUsage={true}
                      isFavorited={true}
                      onToggleFavorite={handleToggleFavorite}
                      className="ring-2 ring-red-100"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* All Other Helpers */}
          {nonFavoriteHelpers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: favoriteHelpers.length > 0 ? 0.3 : 0.2 }}
            >
              {favoriteHelpers.length > 0 && (
                <div className="flex items-center space-x-2 mb-6">
                  <ApperIcon name="Users" size={20} className="text-gray-500" />
                  <h2 className="text-xl font-semibold text-charcoal">
                    All Helpers ({nonFavoriteHelpers.length})
                  </h2>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nonFavoriteHelpers.map((helper, index) => (
                  <motion.div
                    key={helper.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <HelperCard
                      helper={helper}
                      showUsage={true}
                      isFavorited={false}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Empty
            type="helpers"
            message={searchTerm ? `No helpers found matching "${searchTerm}"` : 'No helpers available'}
            onAction={searchTerm ? () => setSearchTerm('') : undefined}
            actionText={searchTerm ? 'Clear search' : undefined}
          />
        </motion.div>
      )}
    </div>
  );
};

export default MyAIHelpers;