// src/App.tsx

// STEP 1: Import 'Suspense' and 'lazy' from React.
import { useState, Suspense, lazy } from 'react';

// We still need ApiProvider for the context.
import { ApiProvider } from './components/APIcontext.tsx';

// These components are part of the initial page load, so they are imported statically.
import ModelViewer from './components/ModelViewer.tsx';
import { NavBar } from './components/NavBar.tsx';
import { PopupModal } from './components/PopupModal.tsx';

// We no longer need to import the popup components statically.
// import { GenerationLogViewer } from './components/GenerationLogViewer.tsx'; <-- Removed
// import { InteractiveStoryUI } from './components/InteractiveStoryUI.tsx';  <-- Removed

import './styles.css';

// STEP 2: Define the components that should be code-split using React.lazy().
// This tells Vite to put them in separate files.
// Note: The imported files ('./components/StoryGeneratorUI.tsx', etc.) must have a 'default export'.
const StoryGeneratorUI = lazy(() => import('./components/StoryGeneratorUI.tsx'));
const InteractiveStoryUI = lazy(() => import('./components/InteractiveStoryUI.tsx'));


function App() {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // The StoryGeneratorUI component definition is now removed from here.

  const logoTransformControls = [
    { property: 'rotation.x', inputType: 'mouse', mapping: () => 0 },
    { property: 'position.x', inputType: 'mouse', mapping: () => -1.125 },
    { property: 'position.z', inputType: 'mouse', mapping: () => -1.125 },
    { property: 'rotation.y', inputType: 'mouse', mapping: () => -3.14 / 2 },
  ];

  const handleClosePopup = () => {
    setActivePopup(null);
  };

  const renderPopupContent = () => {
    // This logic remains the same.
    if (activePopup === 'story') return <StoryGeneratorUI />;
    if (activePopup === 'interactive_story') return <InteractiveStoryUI />;
    if (activePopup === 'future1') return <div className="p-8 text-2xl font-bold">Project "Future One" Details</div>;
    if (activePopup === 'future2') return <div className="p-8 text-2xl font-bold">Project "Future Two" Details</div>;
    return null;
  };

  return (
    <ApiProvider>
      <NavBar className="fixed top-0 left-0 w-full z-10" />
      <div className="relative w-full h-screen bg-gray-200">
        <ModelViewer
          objectsToPaint={[            
            { name: '1', color: '#FF5733' }, 
            { name: '3', color: '#33FFFF' },
            { name: '3001', color: '#2EFF40' } 
          ]}

          objToDisplay="/bookshelf1.glb"
          transformControls={logoTransformControls as any}
          onObjectClick={(object) => {
            console.log(object.name);
            if (object.name === '1') {
              setActivePopup('story');
            }
            if (object.name === '3') {
              setActivePopup('interactive_story');
            }
            if (object.name === '3001') {
              // setActivePopup('story');
            }
          }}
        />
      </div>
      {activePopup && (
        <PopupModal onClose={handleClosePopup}>
          {/* STEP 3: Wrap the rendered content in a <Suspense> component. */}
          {/* This shows a fallback UI (like a loading message) while the component's code is being downloaded. */}
          <Suspense fallback={<div className="p-8 text-center text-white">Loading...</div>}>
            {renderPopupContent()}
          </Suspense>
        </PopupModal>
      )}
    </ApiProvider>
  );
}

export default App;
