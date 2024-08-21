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
          <header className="fixed top-0 left-0 right-0 screen border-b border-solid border-black z-10">
            <div className="max-w-7xl mx-4 pt-6 pb-1 flex justify-between items-center">
              <h1 className="text-base font-medium text-black">
                To All The Boys.
              </h1>
              <button
                onClick={handleViewChange}
                className="text-sm text-black px-4 py-1"
              >
                {view === 'grid' ? 'B' : 'A'} View
              </button>
            </div>
          </header>
          <main>
            <CardViewTransition view={view} />
          </main>
        </div>
      </AppProvider>
    </DndProvider>
  );
};

export default Home;