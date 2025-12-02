import React from 'react';
import { NeuroProvider } from './contexts/NeuroContext';
import SpatialCanvas from './components/Canvas/SpatialCanvas';
import HeadsUpDisplay from './components/HUD/HeadsUpDisplay';
import StagingArea from './components/Input/StagingArea';

const App: React.FC = () => {
  return (
    <NeuroProvider>
      <div className="w-screen h-screen flex flex-col relative text-white selection:bg-cyan-500/30">
        <HeadsUpDisplay />
        <SpatialCanvas />
        <StagingArea />
      </div>
    </NeuroProvider>
  );
};

export default App;