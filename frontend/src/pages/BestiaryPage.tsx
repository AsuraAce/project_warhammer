const BestiaryPage = () => {
  const creatures = [
    {
      name: 'Goblin',
      description: 'Small, green-skinned creatures of limited intelligence but considerable malice. Often found in large tribes in forests and mountains.',
      image: 'https://images.unsplash.com/photo-1599493356234-33b910243d46?w=600&q=80'
    },
    {
      name: 'Skaven',
      description: 'Vile rat-men who dwell in a vast under-empire. They are treacherous, cowardly, and prone to using warpstone technology.',
      image: 'https://images.unsplash.com/photo-1574285806138-68353e48e49b?w=600&q=80'
    },
    {
      name: 'Orc',
      description: 'Brutish, green-skinned warriors who live for battle. Their WAAAGH! energy makes them a formidable threat to all civilized lands.',
      image: 'https://images.unsplash.com/photo-1623645939435-47019875933a?w=600&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-serif text-red-500 mb-4 tracking-wider">Bestiary of the Old World</h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Knowledge is your sharpest blade. Study the creatures that lurk in the shadows.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {creatures.map((creature, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <img src={creature.image} alt={creature.name} className="w-full h-56 object-cover"/>
            <div className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">{creature.name}</h2>
              <p className="text-gray-400">
                {creature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestiaryPage;
