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
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              카드 갤러리
            </h1>
            <div>
              <button
                onClick={() => setCurrentView('grid')}
                className={`px-4 py-2 rounded-l-md ${currentView === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Grid View
              </button>
              <button
                onClick={() => setCurrentView('interactive')}
                className={`px-4 py-2 rounded-r-md ${currentView === 'interactive' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
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