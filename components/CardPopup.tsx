import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType } from '../data/cardData';
import { getCategoryColor } from '../data/featureTagData';
import Image from 'next/image';

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
        className="fixed inset-0 bg-slate-900 bg-opacity-80 flex items-center justify-center p-4 z-[60] w-full h-full"
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
          className="bg-white rounded relative shadow-xl p-2 w-8/12 h-4/6 max-lg:w-11/12 max-lg:h-3/4"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('./texture.jpg')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              opacity: 0.2,
            }}
          ></div>
          <div className="h-full flex flex-row max-lg:flex-col">
            <div className="basis-1/2 w-full text-center bg-slate-100 shadow-inner border object-cover overflow-hidden">
            <img 
              src={card.thumbnailImage} 
              alt={card.name}
            />
            </div>
            <div className="p-8 flex-grow flex flex-col items-baseline justify-end">
              <h2 className="text-4xl font-handwriting font-bold text-slate-900">{card.name}</h2>
              <h2 className="text-lg font-handwritingCJK font-bold text-slate-900">{card.originName}</h2>
              <p className="text-lg font-medium text-slate-600 mb-2">{card.universe}</p>
              <p className="text-sm text-gray-600 mb-10">{card.height}</p>
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {card.featureTags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: getCategoryColor(tag) || '#000' }}
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
            className="absolute -bottom-10 right-1/2 translate-x-1/2 p-2 rounded-full bg-white/70 border-b backdrop-blur-xl hover:rotate-12 hover:bg-white/50 transition-all"
          >
            <Image src="./close.svg" alt="Close" width={14} height={14}/>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CardPopup;