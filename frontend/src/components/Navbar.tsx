import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <ul className="flex justify-center space-x-6">
        <li><Link to="/" className="text-lg text-gray-300 hover:text-red-500 transition-colors duration-300">Home</Link></li>
        <li><Link to="/game" className="text-lg text-gray-300 hover:text-red-500 transition-colors duration-300">Play</Link></li>
        <li><Link to="/bestiary" className="text-lg text-gray-300 hover:text-red-500 transition-colors duration-300">Bestiary</Link></li>
        <li><Link to="/careers" className="text-lg text-gray-300 hover:text-red-500 transition-colors duration-300">Careers</Link></li>
        <li><Link to="/lore" className="text-lg text-gray-300 hover:text-red-500 transition-colors duration-300">Lore</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
