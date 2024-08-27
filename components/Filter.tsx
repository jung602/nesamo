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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(prev => prev === categoryName ? null : categoryName);
  };

  const toggleAllCategories = () => {
    setIsExpanded(prev => !prev);
    setSelectedCategory(null);
  };

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const iconVariants = {
    initial: { rotateX: 0 },
    animate: { rotateX: 180 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20, rotate: 0 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotate: `${(i - (featureTags[0].tags.length - 1) / 2) * 5}deg`,
      transition: {
        delay: i * 0.05,
      }
    })
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="mb-4 text-sm">
      <div className="flex justify-center mb-2">
        <button onClick={toggleAllCategories} 
        className="p-2 border border-gray/50 bg-white/50 rounded-full hover:bg-black/10 backdrop-blur-xl ">
          <img 
            src={isExpanded ? "close.svg" : "filter.svg"} 
            alt={isExpanded ? "Close" : "Filter"} 
            className={isExpanded ? "w-6 h-6 p-1" : "w-6 h-6"} 
          />
        </button>
      </div>
      <motion.div className="flex flex-col justify-center gap-2 mb-2">
        <AnimatePresence>
          {isExpanded && featureTags.map((category, categoryIndex) => (
            <motion.div 
              key={category.name} 
              className="flex flex-col items-center"
              variants={categoryVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <motion.button
                onClick={() => handleCategoryClick(category.name)}
                className={`px-3 py-2 backdrop-blur-lg rounded-md border borderbg-white/[.05] hover:hover:backdrop-blur-sm ${
                  selectedCategory === category.name ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  rotate: selectedCategory === category.name 
                    ? `${(category.tags.length - 1) / 2 * -5}deg`
                    : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                    className="mt-2"
                    style={{ transformOrigin: 'top center' }}
                  >
                    <div className="p-2 flex flex-col items-start space-y-2">
                      {category.tags.map((tag, index) => (
                        <motion.div key={tag} variants={itemVariants} custom={index} className="w-full" style={{ transformOrigin: 'top left' }}>
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
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Filter;