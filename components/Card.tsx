import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../data/cardData';
import { getCategoryColor } from '../data/featureTagData';

interface CardProps {
  card: CardType;
  isSelected: boolean;
  onClick: () => void;
  onClose?: () => void;
}

const Card: React.FC<CardProps> = ({ card, isSelected, onClick, onClose }) => {
  return (
    <motion.div 
      layoutId={`card-${card.id}`}
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer
                  ${isSelected ? 'fixed inset-0 z-50 flex items-center justify-center' : ''}`}
      style={{ maxWidth: isSelected ? '100%' : '300px', maxHeight: isSelected ? '100%' : '400px' }}
    >
      <motion.img 
        src={card.thumbnailImage} 
        alt={card.name} 
        className={`w-full object-cover ${isSelected ? 'h-64' : 'h-48'}`}
      />
      <motion.div className={`p-4 ${isSelected ? 'overflow-y-auto' : ''}`}>
        <h3 className="text-lg font-semibold text-gray-800">{card.name}</h3>
        {isSelected && (
          <>
            <p className="text-gray-600 mt-2">{card.heightWeight}</p>
            <p className="text-gray-600 mt-2">Universe: {card.universe}</p>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Feature Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {card.featureTags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 rounded text-sm text-white"
                    style={{ backgroundColor: getCategoryColor(tag) || '#999' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Card;