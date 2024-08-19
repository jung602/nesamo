import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../data/cardData';
import { getCategoryColor } from '../data/featureTagData';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CardPopupProps {
  card: CardType;
  filteredCards: CardType[];
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const CardPopup: React.FC<CardPopupProps> = ({ card, filteredCards, onClose, onPrevious, onNext }) => {
  const currentIndex = filteredCards.findIndex(c => c.id === card.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < filteredCards.length - 1;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div 
        layoutId={`card-${card.id}`}
        className="bg-white rounded-lg shadow-xl max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-75 transition-colors"
        >
          <X size={24} />
        </button>
        <img 
          src={card.thumbnailImage} 
          alt={card.name} 
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{card.name}</h2>
          <p className="text-gray-600 mb-4">{card.heightWeight}</p>
          <p className="text-gray-600 mb-4">Universe: {card.universe}</p>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Feature Tags:</h3>
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
        </div>
        {hasPrevious && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrevious(); }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CardPopup;