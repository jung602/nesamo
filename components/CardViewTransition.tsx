import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDrag, useDrop } from 'react-dnd';
import { useAppState } from '../context/AppContext';
import Card from './Card';
import CardPopup from './CardPopup';

interface CardViewTransitionProps {
  view: 'grid' | 'interactive';
}

interface DraggableCardProps {
  card: any;
  position: { x: number; y: number; rotation: number };
  onMove: (id: number, left: number, top: number) => void;
  onClick: () => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card, position, onMove, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id: card.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(ref);

  const handleClick = useCallback(() => {
    const delay = 200;
    setTimeout(() => {
      if (!isDragging) {
        onClick();
      }
    }, delay);
  }, [isDragging, onClick]);

  return (
    <motion.div
      ref={ref}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `rotate(${position.rotation}deg)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: '300px',
        height: '400px',
      }}
      onClick={handleClick}
    >
      <Card card={card} onClick={() => {}} />
    </motion.div>
  );
};

const CardViewTransition: React.FC<CardViewTransitionProps> = ({ view }) => {
  const { state } = useAppState();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number; rotation: number } }>({});
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePositions = () => {
      const newPositions = state.filteredCards.reduce((acc, card, index) => {
        if (view === 'interactive') {
          acc[card.id] = {
            x: Math.random() * (window.innerWidth - 300),
            y: Math.random() * (window.innerHeight - 400),
            rotation: Math.random() * 30 - 15,
          };
        } else {
          const columns = window.innerWidth >= 1280 ? 4 : window.innerWidth >= 768 ? 3 : window.innerWidth >= 640 ? 2 : 1;
          const cardWidth = 300;
          const cardHeight = 400;
          const gap = 20;
          const columnWidth = (window.innerWidth - (columns + 1) * gap) / columns;
          const col = index % columns;
          const row = Math.floor(index / columns);
          acc[card.id] = {
            x: gap + col * (columnWidth + gap),
            y: gap + row * (cardHeight + gap),
            rotation: 0,
          };
        }
        return acc;
      }, {} as { [key: number]: { x: number; y: number; rotation: number } });
      setPositions(newPositions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [state.filteredCards, view]);

  const handleCardClick = useCallback((cardId: number) => {
    setSelectedCardId(cardId);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedCardId(null);
  }, []);

  const moveCard = useCallback((id: number, left: number, top: number) => {
    setPositions(prev => ({
      ...prev,
      [id]: { ...prev[id], x: left, y: top },
    }));
  }, []);

  const [, drop] = useDrop(() => ({
    accept: 'card',
    drop(item: { id: number }, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const left = Math.round(positions[item.id].x + delta.x);
        const top = Math.round(positions[item.id].y + delta.y);
        moveCard(item.id, left, top);
      }
    },
  }), [positions, moveCard]);

  drop(dropRef);

  return (
    <div ref={dropRef} className="relative flex justify-between w-full min-h-screen bg-gray-100 pt-24">
      {state.filteredCards.map((card) => (
        view === 'interactive' ? (
          <DraggableCard
            key={card.id}
            card={card}
            position={positions[card.id] || { x: 0, y: 0, rotation: 0 }}
            onMove={moveCard}
            onClick={() => handleCardClick(card.id)}
          />
        ) : (
          <motion.div
            key={card.id}
            initial={false}
            animate={{
              x: positions[card.id]?.x || 0,
              y: positions[card.id]?.y || 0,
              rotate: positions[card.id]?.rotation || 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ position: 'absolute', width: 300, height: 400 }}
            onClick={() => handleCardClick(card.id)}
          >
            <Card card={card} onClick={() => {}} />
          </motion.div>
        )
      ))}
      {selectedCardId !== null && (
        <CardPopup
          card={state.filteredCards.find(card => card.id === selectedCardId)!}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default CardViewTransition;