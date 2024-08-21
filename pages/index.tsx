import type { NextPage } from 'next';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppProvider } from '../context/AppContext';
import CardViewTransition from '../components/CardViewTransition';

const Home: NextPage = () => {
  const [view, setView] = useState<'grid' | 'interactive'>('grid');

  const handleViewChange = () => {
    setView(prevView => prevView === 'grid' ? 'interactive' : 'grid');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <AppProvider>
        <div className="min-h-screen bg-white">
          <header className="bg-white fixed top-0 left-0 right-0 z-10">
            <div className="max-w-7xl mx-4 py-6 flex justify-between items-center border-b border-solid border-black">
              <h1 className="text-3xl font-medium text-gray-900">
                To All The Boys.
              </h1>
              <button
                onClick={handleViewChange}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Switch to {view === 'grid' ? 'Interactive' : 'Grid'} View
              </button>
            </div>
          </header>
          <main className="pt-20">
            <CardViewTransition view={view} />
          </main>
        </div>
      </AppProvider>
    </DndProvider>
  );
};

export default Home;