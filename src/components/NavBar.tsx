import React from 'react';

export const NavBar = () => {
  return (
    <header className="fixed top-0 left-0 w-full shadow z-700"> {/* increase shadow, display only if we scrolled down */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#ff991f]">Sunbull</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="px-3 py-1 text-lg hover:text-[#ff991f]">Home</a></li>
            <li><a href="#" className="px-3 py-1 text-lg hover:text-[#ff991f]">Contact</a></li>
            <li><a href="#" className="px-3 py-1 text-lg hover:text-[#ff991f]">Refer a Friend or Family & Get $500.</a></li>
            <li id="Schedule Call"><a href="#" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-[#ff991f]">Schedule Call</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};