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
interface SectionTwoProps {
  className?: string; // Optional className prop
}

// Update the component to accept props
export const SectionTwo: React.FC<SectionTwoProps> = ({ className }) => {
  return (
    <div className="relative w-full h-screen">
        <div className="w-64 h-64">
            <ModelViewer
            objectsToPaint={[]}
            objToDisplay="/window.glb"
            transformControls={logoTransformControls}
            />
        </div>

    </div>
  );
};