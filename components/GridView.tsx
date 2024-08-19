import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import Card from './Card';
import CardPopup from './CardPopup';
import Filter from './Filter';

const GridView: React.FC = () => {
  const { state, toggleFilter } = useAppState();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

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
      className="container mx-auto p-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <Filter 
        featureTags={state.featureTags}
        activeFilters={state.activeFilters}
        onFilterChange={toggleFilter}
      />
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {state.filteredCards.map((card) => (
            <motion.div
              key={card.id}
              layout
              className={selectedCardId === card.id ? 'fixed inset-0 z-50 flex items-center justify-center' : ''}
            >
              <Card
                card={card}
                isSelected={selectedCardId === card.id}
                onClick={() => setSelectedCardId(card.id)}
                onClose={() => setSelectedCardId(null)}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
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

export default GridView;