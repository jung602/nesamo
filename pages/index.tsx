import type { NextPage } from 'next';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from '../context/AppContext';
import GridView from '../components/GridView';
import InteractiveView from '../components/InteractiveView';

const Home: NextPage = () => {
  const [currentView, setCurrentView] = useState<'grid' | 'interactive'>('grid');

  return (
    <AppProvider>
      <div className="min-h-screen bg-white">
        <header className="bg-white">
          <div className="max-w-7xl mx-4 pt-6 flex justify-between items-center border-b border-solid border-black">
            <h1 className="text-3l font-medium text-gray-900">
            To All The Boys.
            </h1>
            <div>
              <button
                onClick={() => setCurrentView('grid')}
                className={`px-4 py-2  ${currentView === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
              >
                Grid View
              </button>
              <button
                onClick={() => setCurrentView('interactive')}
                className={`px-4 py-2 ${currentView === 'interactive' ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
              >
                Interactive View
              </button>
            </div>
          </div>
        </header>
        <main>
          <AnimatePresence mode="wait">
            {currentView === 'grid' ? (
              <GridView key="grid" />
            ) : (
              <InteractiveView key="interactive" />
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppProvider>
  );
};

export default Home;