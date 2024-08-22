import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import Card from './Card';
import CardPopup from './CardPopup';
import Filter from './Filter';
import { Card as CardType } from '../data/cardData';
import { FeatureTagData } from '../data/featureTagData';

interface CardViewTransitionProps {
  view: 'grid' | 'interactive';
}

interface CardPosition {
  x: number;
  y: number;
  rotation: number;
}

const CardViewTransition: React.FC<CardViewTransitionProps> = ({ view }) => {
  const { state, toggleFilter } = useAppState();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [positions, setPositions] = useState<{ [key: number]: CardPosition }>({});
  const [isDragging, setIsDragging] = useState<{ [key: number]: boolean }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOriginRef = useRef<{ [key: number]: { x: number; y: number } }>({});

  const updateCardPositions = useCallback((cards: CardType[], containerWidth: number, containerHeight: number, forceUpdate: boolean = false) => {
    setPositions(prevPositions => {
      const newPositions: { [key: number]: CardPosition } = {};
      cards.forEach((card) => {
        if (view === 'interactive') {
          const cardWidth = 150; // Half of the original size
          const cardHeight = 200; // Half of the original size
          const maxX = containerWidth - cardWidth;
          const maxY = containerHeight - cardHeight;
          
          if (forceUpdate || !prevPositions[card.id]) {
            newPositions[card.id] = {
              x: Math.random() * (maxX - 20) + 10, // Ensure cards are within bounds
              y: Math.random() * (maxY - 20) + 10,
              rotation: Math.random() * 30 - 15,
            };
          } else {
            // Adjust position if card is out of bounds
            let x = prevPositions[card.id].x;
            let y = prevPositions[card.id].y;
            
            if (x < 0) x = 10;
            if (x > maxX) x = maxX - 10;
            if (y < 0) y = 10;
            if (y > maxY) y = maxY - 10;
            
            newPositions[card.id] = {
              x,
              y,
              rotation: prevPositions[card.id].rotation,
            };
          }
        } else {
          // Grid view logic
          const columns = containerWidth >= 1280 ? 4 : containerWidth >= 768 ? 3 : containerWidth >= 640 ? 2 : 1;
          const cardWidth = 300;
          const cardHeight = 400;
          const gap = 20;
          const columnWidth = (containerWidth - (columns + 1) * gap) / columns;
          const col = Object.keys(newPositions).length % columns;
          const row = Math.floor(Object.keys(newPositions).length / columns);
          newPositions[card.id] = {
            x: gap + col * (columnWidth + gap),
            y: gap + row * (cardHeight + gap),
            rotation: 0,
          };
        }
      });
      return newPositions;
    });
  }, [view]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (view === 'interactive') {
          // Move cards inside the container if they're outside after resize
          setPositions(prevPositions => {
            const newPositions = { ...prevPositions };
            Object.keys(newPositions).forEach(id => {
              const cardId = parseInt(id);
              const cardWidth = 150;
              const cardHeight = 200;
              const maxX = clientWidth - cardWidth;
              const maxY = clientHeight - cardHeight;

              if (newPositions[cardId].x < 0) newPositions[cardId].x = 10;
              if (newPositions[cardId].x > maxX) newPositions[cardId].x = maxX - 10;
              if (newPositions[cardId].y < 0) newPositions[cardId].y = 10;
              if (newPositions[cardId].y > maxY) newPositions[cardId].y = maxY - 10;
            });
            return newPositions;
          });
        } else {
          updateCardPositions(state.filteredCards, clientWidth, clientHeight, true);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.filteredCards, updateCardPositions, view]);

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      updateCardPositions(state.filteredCards, clientWidth, clientHeight, true);
    }
  }, [view, updateCardPositions, state.filteredCards]);

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>, cardId: number) => {
    if (view === 'interactive') {
      const cardElement = event.currentTarget;
      const rect = cardElement.getBoundingClientRect();
      
      // Calculate the offset from the mouse position to the card's center
      dragOriginRef.current[cardId] = {
        x: event.clientX - (rect.left + rect.width / 2),
        y: event.clientY - (rect.top + rect.height / 2)
      };
      setIsDragging(prev => ({ ...prev, [cardId]: true }));
    }
  };

  const handleDrag = (cardId: number, _: unknown, info: PanInfo) => {
    if (view === 'interactive' && dragOriginRef.current[cardId] && containerRef.current) {
      const { x: offsetX, y: offsetY } = dragOriginRef.current[cardId];
      const { clientWidth, clientHeight } = containerRef.current;
      const cardWidth = 150;
      const cardHeight = 200;
      const maxX = clientWidth - cardWidth;
      const maxY = clientHeight - cardHeight;
      
      // Calculate new position based on the mouse position and offset
      let newX = info.point.x - offsetX - cardWidth / 2;
      let newY = info.point.y - offsetY - cardHeight / 2;

      // Ensure the card stays within the container
      if (newX < 0) newX = 0;
      if (newX > maxX) newX = maxX;
      if (newY < 0) newY = 0;
      if (newY > maxY) newY = maxY;

      setPositions(prev => ({
        ...prev,
        [cardId]: { 
          ...prev[cardId], 
          x: newX,
          y: newY
        },
      }));
    }
  };

  const handleDragEnd = (cardId: number, _: unknown, info: PanInfo) => {
    if (view === 'interactive' && containerRef.current && dragOriginRef.current[cardId]) {
      const { clientWidth, clientHeight } = containerRef.current;
      const cardWidth = 150;
      const cardHeight = 200;
      const maxX = clientWidth - cardWidth;
      const maxY = clientHeight - cardHeight;
      const { x: offsetX, y: offsetY } = dragOriginRef.current[cardId];

      // Calculate final position based on the mouse position and offset
      let x = info.point.x - offsetX - cardWidth / 2;
      let y = info.point.y - offsetY - cardHeight / 2;

      if (x < 0) x = 0;
      if (x > maxX) x = maxX;
      if (y < 0) y = 0;
      if (y > maxY) y = maxY;

      setPositions(prev => ({
        ...prev,
        [cardId]: { ...prev[cardId], x, y },
      }));

      delete dragOriginRef.current[cardId];
      setIsDragging(prev => ({ ...prev, [cardId]: false }));
    }
  };

  const handleCardClick = useCallback((cardId: number) => {
    setSelectedCardId(cardId);
  }, []);

  const handleClosePopup = useCallback(() => {
    setSelectedCardId(null);
  }, []);

  const getCardStyle = (card: CardType) => {
    const position = positions[card.id];
    const scale = view === 'interactive' ? 0.5 : 1;
    return {
      position: 'absolute' as 'absolute',
      left: position?.x || 0,
      top: position?.y || 0,
      transform: `rotate(${position?.rotation || 0}deg) scale(${scale})`,
      zIndex: selectedCardId === card.id ? 10 : 1,
      width: view === 'interactive' ? '150px' : '300px',
      height: view === 'interactive' ? '200px' : '400px',
    };
  };

  const gridTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 1,
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full mt-24 min-h-screen bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed top-14 left-0 right-0 z-20 bg-white pt-2">
        <Filter 
          featureTags={state.featureTags as FeatureTagData}
          activeFilters={state.activeFilters}
          onFilterChange={toggleFilter}
        />
      </div>
      <div className="pt-24">
        <AnimatePresence>
          {state.filteredCards.map((card: CardType) => (
            <motion.div
              key={card.id}
              style={getCardStyle(card)}
              initial={view === 'grid' ? { opacity: 0, scale: 0.8 } : undefined}
              animate={view === 'grid' 
                ? { opacity: 1, scale: 1, ...getCardStyle(card) } 
                : { scale: 0.5, rotate: positions[card.id]?.rotation || 0, ...getCardStyle(card) }
              }
              exit={view === 'grid' ? { opacity: 0, scale: 0.8 } : undefined}
              transition={isDragging[card.id] ? { duration: 0 } : (view === 'grid' ? gridTransition : { type: 'spring', stiffness: 300, damping: 25 })}
              drag={view === 'interactive'}
              dragMomentum={false}
              dragElastic={0}
              onPointerDown={(e) => handleDragStart(e, card.id)}
              onDrag={(_, info) => handleDrag(card.id, _, info)}
              onDragEnd={(_, info) => handleDragEnd(card.id, _, info)}
              onClick={() => handleCardClick(card.id)}
              whileDrag={{ scale: 0.6, zIndex: 10, transition: { duration: 0 } }}
            >
              <Card
                card={card}
                onClick={() => {}} // Card 컴포넌트 내부 클릭 이벤트 비활성화
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {selectedCardId !== null && (
          <CardPopup
            card={state.filteredCards.find(card => card.id === selectedCardId)!}
            onClose={handleClosePopup}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CardViewTransition;