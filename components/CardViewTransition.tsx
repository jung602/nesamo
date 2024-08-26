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

  const TOP_OFFSET = 120; // Filter area height

  const updateCardPositions = useCallback((cards: CardType[], containerWidth: number, containerHeight: number, forceUpdate: boolean = false) => {
    setPositions(prevPositions => {
      const newPositions: { [key: number]: CardPosition } = {};
      if (view === 'grid') {
        const cardWidth = 300; // Original card width
        const cardHeight = 400; // Original card height
        const gap = 16; // Gap between cards
        
        // Calculate the number of columns based on container width
        const columns = Math.max(Math.floor((containerWidth + gap) / (cardWidth + gap)), 1);
        
        // Calculate the total width of all cards and gaps
        const totalCardsWidth = columns * cardWidth + (columns - 1) * gap;
        
        // Calculate the left offset to center the grid
        const leftOffset = (containerWidth - totalCardsWidth) / 2;

        cards.forEach((card, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          newPositions[card.id] = {
            x: leftOffset + col * (cardWidth + gap),
            y: TOP_OFFSET + gap + row * (cardHeight + gap),
            rotation: 0,
          };
        });
      } else {
        // Interactive view logic (unchanged)
        cards.forEach((card) => {
          if (forceUpdate || !prevPositions[card.id]) {
            newPositions[card.id] = {
              x: Math.random() * (containerWidth - 150),
              y: Math.random() * (containerHeight - 200 - TOP_OFFSET) + TOP_OFFSET,
              rotation: Math.random() * 30 - 15,
            };
          } else {
            newPositions[card.id] = prevPositions[card.id];
          }
        });
      }
      return newPositions;
    });
  }, [view]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        updateCardPositions(state.filteredCards, clientWidth, clientHeight, false);
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
      
      let newX = info.point.x - offsetX - cardWidth / 2;
      let newY = info.point.y - offsetY - cardHeight / 2;

      if (newX < 0) newX = 0;
      if (newX > maxX) newX = maxX;
      if (newY < TOP_OFFSET) newY = TOP_OFFSET;
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

      let x = info.point.x - offsetX - cardWidth / 2;
      let y = info.point.y - offsetY - cardHeight / 2;

      if (x < 0) x = 0;
      if (x > maxX) x = maxX;
      if (y < TOP_OFFSET) y = TOP_OFFSET;
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

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: view === 'interactive' ? '100vh' : 'auto',
    minHeight: '100vh',
    overflowY: view === 'interactive' ? 'hidden' : 'auto',
    overflowX: 'hidden',
    background: 'white',
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-full min-h-screen bg-white overflow-hidden"
      style={{
        height: view === 'interactive' ? '100vh' : 'auto',
        overflowY: view === 'interactive' ? 'hidden' : 'auto',
      }}
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
      <div className="pt-48">
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
                onClick={() => {}}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <div
        className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        ></div>
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