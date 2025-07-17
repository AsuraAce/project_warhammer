const CareerPage = () => {
  const careers = [
    {
      name: 'Witch Hunter',
      description: 'A grim and determined agent of the state, tasked with hunting down and eradicating heretics, mutants, and witches. They are feared and respected in equal measure.',
      image: 'https://images.unsplash.com/photo-1559648206-53a33feb8163?w=600&q=80'
    },
    {
      name: 'Mercenary Captain',
      description: 'A seasoned warrior who sells their sword to the highest bidder. They are skilled tacticians and leaders, commanding a company of hardened soldiers.',
      image: 'https://images.pexels.com/photos/1103829/pexels-photo-1103829.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Wizard\'s Apprentice',
      description: 'A student of the arcane arts, bound to a master wizard. They wield powerful but often unpredictable magic, risking damnation for knowledge and power.',
      image: 'https://images.pexels.com/photos/209568/pexels-photo-209568.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-serif text-red-500 mb-4 tracking-wider">Paths of Adventure</h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          In the Old World, you are what you do. Choose your path, but choose wisely.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {careers.map((career, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <img src={career.image} alt={career.name} className="w-full h-56 object-cover"/>
            <div className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">{career.name}</h2>
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
