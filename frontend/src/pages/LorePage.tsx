const LorePage = () => {
  const loreTopics = [
    {
      title: 'The Empire',
      description: 'The largest and most powerful nation of men in the Old World. A bastion of civilization, it is beset by enemies from within and without.',
      image: 'https://images.unsplash.com/photo-1597879948903-349544791e53?w=600&q=80'
    },
    {
      title: 'The Chaos Wastes',
      description: 'A surreal, daemon-infested wasteland to the north where the laws of reality break down. From here, the armies of Chaos launch their invasions.',
      image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      title: 'The Dwarfen Holds',
      description: 'The ancient, mountain kingdoms of the Dwarfs. Though diminished from their former glory, they are still masters of engineering and stubborn warriors.',
      image: 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-serif text-red-500 mb-4 tracking-wider">Chronicles of the Old World</h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Delve into the sagas and histories of a dark and perilous age.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {loreTopics.map((topic, index) => (
          <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <img src={topic.image} alt={topic.title} className="w-full h-56 object-cover"/>
            <div className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-2 text-red-400">{topic.title}</h2>
              <p className="text-gray-400">
                {topic.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LorePage;
