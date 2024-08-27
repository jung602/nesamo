import type { NextPage } from 'next';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppProvider } from '../context/AppContext';
import CardViewTransition from '../components/CardViewTransition';
import DataVisualizationDashboard from '../components/DataVisualizationDashboard';
import Image from 'next/image';

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
        <div className="min-h-screen">
          <header 
          className="w-screen flex justify-center backdrop-blur-xl bg-white/30 fixed top-0 left-0 right-0 screen border-b z-50">
            <a 
              href="/"
              className="absolute -translate-x-1/2 left-1/2 text-base font-medium text-black pt-4 z-50">
                <h1>
                  To All The Boys.
                </h1>
            </a>
            
            <div className="z-20 max-w-screen-xl w-full mx-4 pt-1 pb-1 flex justify-between items-center">
                <button
                  onClick={handleViewChange}
                  className={showData ? "opacity-0 w-0 h-0" : "p-3 w-11 h-11 z-50"}
                >
                  {view === 'grid' ? <Image src="./suffle.svg" alt="Shuffle" width={24} height={24}/> : <Image src="./list.svg" alt="List" width={24} height={24}/>}
                </button>
                <button
                  onClick={handleDataToggle}
                  className="p-3 w-11 h-11 z-50"
                >
                  {showData ? <Image src="./close.svg" style={{marginLeft:'1px'}} alt="Close" width={16} height={16}/> : <Image src="./data.svg" alt="Data" width={24} height={24}/>}
                </button>
            </div>
          </header>
          <main>
            <CardViewTransition view={view} />
            <DataVisualizationDashboard isVisible={showData} />
          </main>
        </div>
      </AppProvider>
    </DndProvider>
  );
};

export default Home;