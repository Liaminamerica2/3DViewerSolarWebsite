  import React from 'react';

  // Define the props interface
  interface NavBarProps {
    className?: string; // Optional className prop
  }

  // Update the component to accept props
  export const NavBar: React.FC<NavBarProps> = ({ className }) => {
    return (
      <header 
        // Using a subtle transition for smoothness
        className={`fixed top-0 left-0 w-full shadow-md z-10 bg-[#F2EFE7] transition-all duration-300 ${className || ''}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            
            {/* Left Side: Logo and Title */}
            <div className="flex items-center space-x-4">
              {/* LOGO FIX: Use a fixed height (e.g., h-12) and `w-auto`. 
                This makes the logo bigger while maintaining its aspect ratio without breaking the layout.
              */}
              <img 
                src="/clear-edge-high-resolution-logo-transparent.png" 
                alt="Clear Edge Logo" 
                className="h-12 w-auto" // <-- Best way to size logos
              />
              
              {/* Grouping title and subtitle for better structure */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#006A71] tracking-tight">
                  AI Children's Stories
                </h1>
                <p className="hidden sm:block text-xs text-gray-500 mt-1">
                  Click the colored books to explore different models.
                </p>
              </div>
            </div>

            {/* Right Side: Navigation Links (for future use) */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-[#006A71]">About</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-[#006A71]">Gallery</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-[#006A71]">Contact</a>
            </nav>
            
          </div>
        </div>
      </header>
    );
  };