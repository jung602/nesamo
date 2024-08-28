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
          className="w-screen flex justify-center backdrop-blur-xl bg-white/30 pt-4 pb-2 fixed top-0 left-0 right-0 screen border-b z-50">
            <a 
              href="/"
              className="absolute -translate-x-1/2 left-1/2 text-base font-medium text-black pt-1 z-50">
                <h1>
                  To All The Boys.
                </h1>
            </a>

            <div className="z-20 max-w-screen-xl w-full mx-4 flex justify-between items-center">
                <button
                  onClick={handleViewChange}
                  className={showData ? "opacity-0 w-0 h-0" : "flex justify-center items-center w-8 h-8 z-50 rounded-full hover:bg-slate-100"}
                >
                  {view === 'grid' ? <Image src="./suffle.svg" alt="Shuffle" width={20} height={20}/> : <Image src="./list.svg" alt="List" width={20} height={20}/>}
                </button>
                <button
                  onClick={handleDataToggle}
                  className="flex justify-center items-center w-8 h-8 z-50 rounded-full hover:bg-slate-100"
                >
                  {showData ? <Image src="./close.svg" style={{marginLeft:'1px'}} alt="Close" width={14} height={14}/> : <Image src="./data.svg" alt="Data" width={20} height={20}/>}
                </button>
            </div>
          </header>
          <main className="relative">
            <div className={`transition-opacity duration-300 ${showData ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              <CardViewTransition view={view} />
            </div>
            {showData && (
              <div className="absolute inset-0 z-10">
                <DataVisualizationDashboard isVisible={showData} />
              </div>
            )}
          </main>
        </div>
      </AppProvider>
    </DndProvider>
  );
};

export default Home;