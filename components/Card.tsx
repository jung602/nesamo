import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../data/cardData';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const randomRotation = useMemo(() => Math.random() * 30 - 15, []);

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
      className="relative bg-white rounded border border-solid border-slate-150
      overflow-hidden cursor-pointer shadow-sm 
      transform transition-all duration-200 ease-in-out 
      hover:shadow-xl hover:-translate-y-1"
      style={{ 
        width: '300px', 
        height: '400px', 
        padding: '10px',
        rotate: `${randomRotation}deg`,
        boxShadow: 'inset 0 -.5px 3px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/texture.jpg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.2,  // 10% opacity
        }}
      ></div>
      <div className="relative z-10 h-full flex flex-col">
        <motion.img 
          src={card.thumbnailImage} 
          alt={card.name} 
          className="shadow-inner w-full h-[300px] object-cover bg-gray-100"
        />
        <motion.div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="text-xl font-semibold font-handwriting text-gray-800 mb-2">{card.name}</h3>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Card;