import React from 'react';
import ModelViewer from './ModelViewer';

const objectsToPaint = [
  { name: 'mesh_0', color: '#ff991f' },
  { name: 'mesh_1', color: '#ff991f' },
  { name: 'mesh_2', color: '#ff991f' },
  { name: 'mesh_3', color: '#ff991f' },
  { name: 'mesh_4', color: '#ff991f' },
  { name: 'ALLMESH', color: '#A96200' },
];

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

// Define the props interface
interface NavBarProps {
  className?: string; // Optional className prop
}

// Update the component to accept props
export const NavBar: React.FC<NavBarProps> = ({ className }) => {
  return (
    <header className={`fixed top-0 left-0 w-full shadow z-10 bg-[#F2EFE7] ${className || ''}`}>
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/clear-edge-high-resolution-logo-transparent.png" alt="Clear Edge Logo" className="w-32 h-auto" /> {/*as soon as i change w to 13 or bigger this breaks how to make it bigger?*/}
          <h1 className="text-6xl font-extrabold text-[#006A71] ml-4">Clear Edge</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-4xl px-3 py-1 text-lg text-[#006A71] hover:text-[#48A6A7]">Portfolio</a></li>
            <li><a href="#" className="text-4xl px-3 py-1 text-lg text-[#006A71] hover:text-[#48A6A7]">FAQs</a></li>
            <li><a href="#" className="text-4xl px-3 py-1 text-lg text-[#006A71] hover:text-[#48A6A7]">About</a></li>
            <li><a href="#" className="text-4xl bg-[#006A71] text-white px-4 py-2 rounded-xl hover:bg-[#48A6A7]">Schedule Call</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};


