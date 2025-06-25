import ModelViewer from './components/ModelViewer.tsx';
import { useEffect, useState } from 'react';
import { NavBar } from './components/NavBar.tsx';
import { SectionTwo } from './components/SectionTwo.tsx';

// Colors:
//  Primary: #F2EFE7
//  Second: #9ACBD0
//  Third: #48A6A7
//  Fourth: #006A71

// logo image path: /clear-edge-high-resolution-logo-transparent.png

function App() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const objectsToPaint = [
    { name: 'mesh_0', color: '#ff991f' },
    { name: 'mesh_1', color: '#ff991f' },
    { name: 'mesh_2', color: '#ff991f' },
    { name: 'mesh_3', color: '#ff991f' },
    { name: 'mesh_4', color: '#ff991f' },
    { name: 'ALLMESH', color: '#A96200' },
  ];

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Transformation controls for the logo (mouse-based rotation)
  const logoTransformControls = [
    {
      property: 'rotation.y' as 'rotation.y',
      inputType: 'mouse' as 'mouse',
      mapping: (mouse: { x: number; y: number }) => {
        const sensitivity = 0.5;
        const adjustedMouseX = Math.sign(mouse.x) * Math.pow(Math.abs(mouse.x), sensitivity);
        return adjustedMouseX * (Math.PI / 6) - Math.PI / 4;
      },
    },
    {
      property: 'rotation.x' as 'rotation.x',
      inputType: 'mouse' as 'mouse',
      mapping: (mouse: { x: number; y: number }) => {
        const sensitivity = 0.5;
        const adjustedMouseY = Math.sign(mouse.y) * Math.pow(Math.abs(mouse.y), sensitivity);
        return adjustedMouseY * (Math.PI / 6);
      },
    },
  ];

  // Transformation controls for the house (scroll-based rotation)
  const houseTransformControls = [
    {
      property: 'rotation.y' as 'rotation.y',
      inputType: 'scroll' as 'scroll',
      mapping: (scrollY: number) => (scrollY / 1000) * Math.PI,
    },
  ];

  return (
    <>
      {/* Fixed Navigation Bar */}
      <NavBar className="fixed top-0 left-0 w-full z-10" />

      {/* Scrollable Video Section */}
      <div className="relative w-full h-screen">
        <video
          loop
          autoPlay
          muted
          playsInline
          preload="none"
          src="/file.mp4"
          className="w-full h-full object-cover"
        >
          <source
            type="video/mp4"
            src="/file.mp4"
          />
        </video>
      </div>


      <SectionTwo />
      

      {/*
      
      <div className="p-4">
        <h1 className="text-3xl font-bold">Welcome to My Website</h1>
        <p className="mt-4">
          This is some content below the video. As you scroll, the video will move up and out of view, while the navigation bar remains fixed at the top.
        </p>
        <p className="mt-4">
          Add more content here to make the page longer and demonstrate the scrolling effect.
        </p>
      </div>


      */}
    </>
  );
}

export default App;