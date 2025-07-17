const App = () => {
    const { useState, useEffect } = React;

    const [game, setGame] = useState(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStartGame = async () => {
        setLoading(true);
        try {
            // 1. Create a new character
            const charRes = await fetch('/api/characters/start-new', { method: 'POST' });
            const character = await charRes.json();

            // 2. Start a new game with that character
            const gameRes = await fetch('/api/game/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ characterId: character._id })
            });
            const newGame = await gameRes.json();
            setGame(newGame);
        } catch (error) {
            console.error('Failed to start game:', error);
        }
        setLoading(false);
    };

    const handleSendAction = async () => {
        if (!input.trim() || !game) return;

        const action = input;
        const playerActionEntry = { type: 'player', content: action };
        const thinkingEntry = { type: 'system', content: 'The Game Master ponders your action...' };

        setGame(prevGame => ({
            ...prevGame,
            log: [...prevGame.log, playerActionEntry, thinkingEntry]
        }));

        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`/api/game/${game._id}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            if (!res.ok) {
                throw new Error(`Server responded with status: ${res.status}`);
            }

            const updatedGame = await res.json();
            setGame(updatedGame);
        } catch (error) {
            console.error('--- FRONTEND FETCH ERROR ---', error);
            setGame(prevGame => ({
                ...prevGame,
                log: [...prevGame.log.slice(0, -1), { type: 'system', content: `An error occurred: ${error.message}. Please try again.` }]
            }));
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">WFRP LLM Adventure</h1>
            
            {!game ? (
                <div className="text-center">
                    <button 
                        onClick={handleStartGame}
                        className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 disabled:opacity-75"
                        disabled={loading}
                    >
                        {loading ? 'The Game Master is conjuring a new adventure... (this may take a moment)' : 'New Game'}
                    </button>
                </div>
            ) : (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div id="game-log" className="h-96 overflow-y-auto mb-4 p-2 border border-gray-600 rounded">
                        {game.log.map((entry, index) => (
                            <p key={index} className={`mb-2 ${entry.type === 'system' ? 'text-yellow-400' : 'text-white'}`}>
                                <strong>{entry.type === 'player' ? 'You' : 'GM'}:</strong> {entry.content}
                            </p>
                        ))}
                    </div>
                    <div className="flex">
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendAction()}
                            className="flex-grow bg-gray-700 text-white rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="What do you do?"
                            disabled={loading}
                        />
                        <button 
                            onClick={handleSendAction}
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-r-md"
                            disabled={loading}
                        >
                            {loading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
