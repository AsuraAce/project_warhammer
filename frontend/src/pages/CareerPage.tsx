import React, { useState, useEffect } from 'react';

interface Career {
  _id: string;
  id: string;
  title: string;
  description: string;
  image?: string;
}

const CareerPage: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/data/careers');
        if (!response.ok) {
          throw new Error('Failed to fetch careers');
        }
        const data = await response.json();
        setCareers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8 font-sans text-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-white p-8 font-sans text-center">Error: {error}</div>;

  const filteredCareers = careers.filter(
    career => career.title && career.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-serif text-red-500 mb-4 tracking-wider">Paths of Adventure</h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          In the Old World, you are what you do. Choose your path, but choose wisely.
        </p>
      </header>

      <div className="mb-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search for a career..."
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredCareers.map(career => (
          <div key={career._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <img src={career.image || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&q=80'} alt={career.title} className="w-full h-56 object-cover"/>
            <div className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">{career.title}</h2>
              <p className="text-gray-400">
                {career.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerPage;
