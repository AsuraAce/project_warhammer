import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gray-800 bg-opacity-50" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h1 className="font-serif text-6xl font-bold text-red-500 mb-4 tracking-wider">A Grim World of Perilous Adventure</h1>
        <p className="font-sans text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Experience Warhammer Fantasy Roleplay like never before, powered by an intelligent AI Game Master that brings the Old World to life.</p>
        <Link to="/game" className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
          Start Your Adventure
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
              <img src="https://images.pexels.com/photos/357514/pexels-photo-357514.jpeg?auto=compress&cs=tinysrgb&w=600" alt="AI Game Master" className="mx-auto mb-4 rounded-lg h-48 w-full object-cover"/>
              <h3 className="font-serif text-2xl font-bold mb-2">AI Game Master</h3>
              <p className="font-sans text-gray-400">A sophisticated AI that crafts dynamic narratives, manages NPCs, and adjudicates rules, providing a seamless and immersive roleplaying experience.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
              <img src="https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Dynamic Storytelling" className="mx-auto mb-4 rounded-lg h-48 w-full object-cover"/>
              <h3 className="font-serif text-2xl font-bold mb-2">Dynamic Storytelling</h3>
              <p className="font-sans text-gray-400">Your choices matter. The AI adapts the story in real-time based on your actions, creating a unique adventure every time you play.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
              <img src="https://images.pexels.com/photos/1114896/pexels-photo-1114896.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Rich World Exploration" className="mx-auto mb-4 rounded-lg h-48 w-full object-cover"/>
              <h3 className="font-serif text-2xl font-bold mb-2">Rich World Exploration</h3>
              <p className="font-sans text-gray-400">Explore the dark and gritty cities, treacherous mountains, and haunted forests of the Old World, all brought to life with rich descriptions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-800 py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="font-serif text-4xl font-bold mb-4">About This Project</h2>
          <p className="font-sans text-lg text-gray-400">
            This project is a passion project to explore the possibilities of using Large Language Models to create compelling, interactive roleplaying experiences. It combines the rich lore of Warhammer Fantasy with cutting-edge AI to create a new way to play.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
