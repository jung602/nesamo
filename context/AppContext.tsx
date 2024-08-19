import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card } from '../data/cardData';
import { loadCardData } from '../utils/dataLoader';
import { FeatureTagData, featureTagData } from '../data/featureTagData';

type AppState = {
  cards: Card[];
  filteredCards: Card[];
  currentView: 'grid' | 'interactive';
  activeFilters: string[];
  featureTags: FeatureTagData;
};

type AppContextType = {
  state: AppState;
  setCurrentView: (view: 'grid' | 'interactive') => void;
  toggleFilter: (tag: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    cards: [],
    filteredCards: [],
    currentView: 'grid',
    activeFilters: [],
    featureTags: featureTagData,
  });

  useEffect(() => {
    loadCardData().then(loadedCards => {
      setState(prevState => ({ ...prevState, cards: loadedCards, filteredCards: loadedCards }));
    });
  }, []);

  useEffect(() => {
    const newFilteredCards = state.activeFilters.length === 0
      ? state.cards
      : state.cards.filter(card => 
          state.activeFilters.every(filter => card.featureTags.includes(filter))
        );
    setState(prevState => ({ ...prevState, filteredCards: newFilteredCards }));
  }, [state.cards, state.activeFilters]);

  const setCurrentView = (view: 'grid' | 'interactive') => {
    setState(prevState => ({ ...prevState, currentView: view }));
  };

  const toggleFilter = (tag: string) => {
    setState(prevState => ({
      ...prevState,
      activeFilters: prevState.activeFilters.includes(tag)
        ? prevState.activeFilters.filter(t => t !== tag)
        : [...prevState.activeFilters, tag],
    }));
  };

  return (
    <AppContext.Provider value={{ state, setCurrentView, toggleFilter }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};