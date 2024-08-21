import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../data/cardData';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const randomRotation = useMemo(() => Math.random() * 30 - 10, []);

  // onClick이 함수인지 확인
  if (typeof onClick !== 'function') {
    console.error('onClick is not a function in Card component');
    return null;
  }

  return (
    <motion.div 
      layoutId={`card-${card.id}`}
      onClick={() => {
        console.log('Card component clicked:', card.id); // 디버깅을 위한 로그
        onClick();
      }}
      className="bg-white overflow-hidden cursor-pointer shadow-md transform transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1"
      style={{ 
        width: '300px', 
        height: '400px', 
        padding: '10px',
        rotate: `${randomRotation}deg`,
      }}
    >
      <div className="bg-gray-100 h-full flex flex-col">
        <motion.img 
          src={card.thumbnailImage} 
          alt={card.name} 
          className="w-full h-[300px] object-cover"
        />
        <motion.div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="text-2xl font-handwriting text-gray-800 mb-2">{card.name}</h3>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Card;