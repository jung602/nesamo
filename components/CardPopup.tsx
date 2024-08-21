import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '../data/cardData';
import { getCategoryColor } from '../data/featureTagData';
import { X } from 'lucide-react';

interface CardPopupProps {
  card: CardType;
  onClose: () => void;
}

const CardPopup: React.FC<CardPopupProps> = ({ card, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="bg-white max-w-md w-full relative shadow-xl"
          style={{ 
            width: '350px', 
            height: '450px', 
            padding: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-100 h-full flex flex-col">
            <img 
              src={card.thumbnailImage} 
              alt={card.name} 
              className="w-full h-[300px] object-cover"
            />
            <div className="p-4 flex-grow flex flex-col justify-between">
              <h2 className="text-3xl font-handwriting text-gray-800 mb-2">{card.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{card.heightWeight}</p>
              <p className="text-sm text-gray-600 mb-2">Universe: {card.universe}</p>
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">Feature Tags:</h3>
                <div className="flex flex-wrap gap-1">
                  {card.featureTags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-0.5 rounded text-xs text-white"
                      style={{ backgroundColor: getCategoryColor(tag) || '#999' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-75 transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CardPopup;