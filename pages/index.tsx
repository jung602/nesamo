import type { NextPage } from 'next';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppProvider } from '../context/AppContext';
import CardViewTransition from '../components/CardViewTransition';
import DataVisualizationDashboard from '../components/DataVisualizationDashboard';


const Home: NextPage = () => {
  const [view, setView] = useState<'grid' | 'interactive'>('grid');
  const [showData, setShowData] = useState(false);

  const handleViewChange = () => {
    setView(prevView => prevView === 'grid' ? 'interactive' : 'grid');
  };

  const handleDataToggle = () => {
    setShowData(prev => !prev);
  };


  return (
    <DndProvider backend={HTML5Backend}>
      <AppProvider>
        <div className="min-h-screen bg-white">
          <header className="backdrop-blur-xl bg-white/30 fixed top-0 left-0 right-0 screen border-b border-solid border-black z-30">
            <div className="max-w-7xl mx-4 pt-6 pb-1 flex justify-between items-center">
            <a href="/">
              <h1 className="text-base font-medium text-black">
                To All The Boys.
              </h1>
              </a>
              <button
                onClick={handleViewChange}
                className="text-sm text-black px-4 py-1"
              >
                {view === 'grid' ? 'B' : 'A'} View
              </button>
              <button
                onClick={handleDataToggle}
                className="text-sm text-black px-4 py-1"
              >
                {showData ? 'Cards' : 'Data'}
              </button>
            </div>
          </header>
          <main>
          {showData ? (
              <DataVisualizationDashboard />
            ) : (
              <CardViewTransition view={view} />
            )}
          </main>
        </div>
      </AppProvider>
    </DndProvider>
  );
};

export default Home;