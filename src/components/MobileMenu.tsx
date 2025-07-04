import React from 'react';

// Define the types for the props
interface MobileMenuProps {
  onSelect: (popup: string) => void;
}

// An array to define our menu items for easy mapping
const menuItems = [
  { id: 'story', title: 'Story Generator', description: 'Let AI write a short story from your prompt.' },
  { id: 'interactive_story', title: 'Interactive Story', description: 'A story where you make the choices.' },
  { id: 'future1', title: 'Project "Future One"', description: 'Discover the details of this upcoming feature.' },
  { id: 'future2', title: 'Project "Future Two"', description: 'Learn more about another secret project.' },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ onSelect }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 bg-gray-900 text-white">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-100">Welcome</h1>
        <p className="text-gray-400 mt-2">Select an experience to begin</p>
      </div>
      <div className="w-full max-w-md space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-full text-left p-5 bg-gray-800 rounded-lg shadow-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-colors duration-200"
          >
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="text-gray-300 mt-1 text-sm">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};