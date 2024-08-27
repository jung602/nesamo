import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, MotionStyle } from 'framer-motion';
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
  const BOTTOM_MARGIN = 64; // Bottom margin for grid view
  const CARD_WIDTH = 300;
  const CARD_HEIGHT = 400;
  const GAP = 16;

  const updateCardPositions = useCallback((cards: CardType[], containerWidth: number, containerHeight: number, forceUpdate: boolean = false) => {
    setPositions(prevPositions => {
      const newPositions: { [key: number]: CardPosition } = {};
      if (view === 'grid') {
        const columns = Math.max(Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP)), 1);
        const totalCardsWidth = columns * CARD_WIDTH + (columns - 1) * GAP;
        const leftOffset = (containerWidth - totalCardsWidth) / 2;

        cards.forEach((card, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);
          newPositions[card.id] = {
            x: leftOffset + col * (CARD_WIDTH + GAP),
            y: TOP_OFFSET + GAP + row * (CARD_HEIGHT + GAP),
            rotation: 0,
          };
        });
      } else {
        // Interactive view logic
        const cardWidth = 150;
        const cardHeight = 200;
        const maxX = containerWidth - cardWidth;
        const maxY = containerHeight - cardHeight;

        cards.forEach((card) => {
          if (forceUpdate || !prevPositions[card.id]) {
            newPositions[card.id] = {
              x: Math.random() * maxX,
              y: Math.random() * (maxY - TOP_OFFSET) + TOP_OFFSET,
              rotation: Math.random() * 30 - 15,
            };
          } else {
            let { x, y, rotation } = prevPositions[card.id];
            if (x < 0) x = 0;
            if (x > maxX) x = maxX;
            if (y < TOP_OFFSET) y = TOP_OFFSET;
            if (y > maxY) y = maxY;
            newPositions[card.id] = { x, y, rotation };
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

  const getContainerStyle = useCallback((): MotionStyle => {
    if (view === 'interactive') {
      return {
        height: '100vh',
        overflow: 'hidden',
      };
    } else {
      return {
        minHeight: '100vh',
        overflowX: 'hidden' as const,
        overflowY: 'auto' as const,
      };
    }
  }, [view]);

  const getGridContainerStyle = useCallback((): React.CSSProperties => {
    if (view === 'grid') {
      const columns = Math.max(Math.floor((containerRef.current?.clientWidth ?? 0 + GAP) / (CARD_WIDTH + GAP)), 1);
      const rows = Math.ceil(state.filteredCards.length / columns);
      return {
        height: `${TOP_OFFSET + GAP + rows * (CARD_HEIGHT + GAP) + BOTTOM_MARGIN}px`,
      };
    }
    return {};
  }, [view, state.filteredCards.length]);

  
  return (
    <div className="relative w-full">
      <motion.div 
        ref={containerRef}
        className="relative w-full"
        style={getContainerStyle()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="fixed top-14 left-0 right-0 z-20 pt-4">
          <Filter 
            featureTags={state.featureTags as FeatureTagData}
            activeFilters={state.activeFilters}
            onFilterChange={toggleFilter}
          />
        </div>
        <div style={getGridContainerStyle()}>
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
      <div 
        className="absolute left-0 right-0 top-0 bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{
          height: '100%',
          minHeight: '100vh',
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default CardViewTransition;