import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeatureTagData } from '../data/featureTagData';
import { X } from 'lucide-react';

interface FilterProps {
  featureTags: FeatureTagData;
  activeFilters: string[];
  onFilterChange: (tag: string) => void;
}

const Filter: React.FC<FilterProps> = ({ featureTags, activeFilters, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleClose = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="mb-4">
      <AnimatePresence mode="wait">
        {selectedCategory === null ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap gap-2"
          >
            {featureTags.map((category) => (
              <motion.button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="pr-4 py-0 bg-white hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="tags"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative bg-white p-4 rounded-md shadow-md"
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-wrap gap-2">
              {featureTags
                .find(category => category.name === selectedCategory)
                ?.tags.map((tag) => (
                  <motion.button
                    key={tag}
                    onClick={() => onFilterChange(tag)}
                    className={`px-2 py-1 rounded text-sm ${
                      activeFilters.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag}
                  </motion.button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filter;