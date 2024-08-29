import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../data/cardData';

interface CardProps {
  card: CardType;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const randomRotation = useMemo(() => Math.random() * 30 - 15, []);
  const randomNameRotation = useMemo(() => Math.random() * 30 - 15, []);
  const randomNamePosition = useMemo(() => ({
    x: Math.random() * 60 - 30, // Random value between -30 and 30
    y: Math.random() * 40 - 20, // Random value between -20 and 20
  }), []);

  if (typeof onClick !== 'function') {
    console.error('onClick is not a function in Card component');
    return null;
  }

  return (
    <motion.div 
      layoutId={`card-${card.id}`}
      onClick={() => {
        console.log('Card component clicked:', card.id);
        onClick();
      }}
      className="relative bg-white rounded border border-solid border-slate-150
      overflow-hidden cursor-pointer shadow-sm 
      transform transition-all duration-200 ease-in-out 
      hover:shadow-xl hover:-translate-y-1"
      style={{ 
        width: '300px', 
        height: '400px', 
        rotate: `${randomRotation}deg`,
        boxShadow: 'inset 0 -.5px 3px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('./texture.jpg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
        }}
      ></div>
      <div className="relative z-10 h-full flex flex-col p-2">
        <motion.img 
          src={card.thumbnailImage} 
          alt={card.name} 
          className="shadow-inner border w-full h-[300px] object-cover 
          bg-[radial-gradient(rgba(51,65,85,.2)_0%,rgba(2,6,23,.3)_100%)]"
        />
        <motion.div className="p-4 flex-grow flex flex-col justify-between relative">
          <motion.h3 
            className="text-3xl flex font-semibold font-handwriting text-black/75 mb-2 absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${randomNamePosition.x}px), calc(-50% + ${randomNamePosition.y}px)) rotate(${randomNameRotation}deg)`,
            }}
          >
            <div 
            className="pr-2"
            style={{
              transform: `rotate(${randomNameRotation}deg)`}}
            >#{card.id}</div>
            <div>{card.name}</div>
          </motion.h3>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Card;