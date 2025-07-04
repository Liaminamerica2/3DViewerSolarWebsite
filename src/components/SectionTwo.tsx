import React from 'react';
import ModelViewer from './ModelViewer';


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
}

// Update the component to accept props
export const SectionTwo: React.FC<SectionTwoProps> = ({  }) => {
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