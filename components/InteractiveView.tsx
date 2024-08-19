import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { useAppState } from '../context/AppContext';
import Card from './Card';
import CardPopup from './CardPopup';
import Filter from './Filter';

const InteractiveView: React.FC = () => {
  const { state, toggleFilter } = useAppState();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const getRandomPosition = () => ({
    x: Math.random() * (window.innerWidth - 200),
    y: Math.random() * (window.innerHeight - 200)
  });

  const handleDragStart = (e: DraggableEvent, data: DraggableData) => {
    dragStartRef.current = { x: data.x, y: data.y };
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData, cardId: number) => {
    if (dragStartRef.current) {
      const dx = data.x - dragStartRef.current.x;
      const dy = data.y - dragStartRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // 이동 거리가 5px 미만일 경우 클릭으로 간주
        setSelectedCardId(cardId);
      }
    }
    dragStartRef.current = null;
  };

  const handlePrevious = () => {
    if (selectedCardId !== null) {
      const currentIndex = state.filteredCards.findIndex(card => card.id === selectedCardId);
      if (currentIndex > 0) {
        setSelectedCardId(state.filteredCards[currentIndex - 1].id);
      }
    }
  };

  const handleNext = () => {
    if (selectedCardId !== null) {
      const currentIndex = state.filteredCards.findIndex(card => card.id === selectedCardId);
      if (currentIndex < state.filteredCards.length - 1) {
        setSelectedCardId(state.filteredCards[currentIndex + 1].id);
      }
    }
  };

  return (
    <motion.div 
      className="relative w-full h-screen bg-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <div className="absolute top-0 left-0 right-0 z-10 bg-white p-4">
        <Filter 
          featureTags={state.featureTags}
          activeFilters={state.activeFilters}
          onFilterChange={toggleFilter}
        />
      </div>
      <div className="pt-24"> {/* Add padding top to account for the filter */}
        <AnimatePresence>
          {state.filteredCards.map((card) => (
            <Draggable 
              key={card.id} 
              defaultPosition={getRandomPosition()}
              onStart={handleDragStart}
              onStop={(e, data) => handleDragStop(e, data, card.id)}
            >
              <div className="absolute cursor-move">
                <Card
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onClick={() => {}} // 클릭 이벤트는 handleDragStop에서 처리합니다
                  onClose={() => setSelectedCardId(null)}
                />
              </div>
            </Draggable>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
      {selectedCardId !== null && (
        <CardPopup
          key={selectedCardId}
          card={state.filteredCards.find(card => card.id === selectedCardId)!}
          filteredCards={state.filteredCards}
          onClose={() => setSelectedCardId(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}
    </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveView;