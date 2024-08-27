import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeatureTagData } from '../data/featureTagData';

interface FilterProps {
  featureTags: FeatureTagData;
  activeFilters: string[];
  onFilterChange: (tag: string) => void;
}

const Filter: React.FC<FilterProps> = ({ featureTags, activeFilters, onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(prev => prev === categoryName ? null : categoryName);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="mb-4 text-sm">
      <div className="flex justify-center gap-2 mb-2 flex-wrap">
        {featureTags.map((category) => (
          <div key={category.name} className="flex flex-col items-center">
            <motion.button
              onClick={() => handleCategoryClick(category.name)}
              className="px-3 py-2 backdrop-blur-lg rounded-md border borderbg-white/[.05] hover:hover:backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
            <AnimatePresence>
              {selectedCategory === category.name && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-2 overflow-hidden"
                >
                  <div className="p-2 flex flex-col items-start space-y-2">
                    {category.tags.map((tag) => (
                      <motion.div key={tag} variants={itemVariants} className="w-full">
                        <label className="flex items-center space-x-2 cursor-pointer py-2 pl-1 pr-3 bg-gray-50 border hover:bg-gray-100 rounded">
                          <input
                            type="checkbox"
                            checked={activeFilters.includes(tag)}
                            onChange={() => onFilterChange(tag)}
                            className="hidden"
                          />
                          <span className={`w-4 h-4 border border-gray-300 rounded-full inline-block ${activeFilters.includes(tag) ? 'bg-black' : 'bg-white'}`}></span>
                          <span>{tag}</span>
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;