import { useState, useEffect, useRef } from 'react';

// Matches the backend ILogEntry interface
interface ILogEntry {
  type: 'narrative' | 'player' | 'roll' | 'system';
  content: string;
  timestamp: string;
}

function GamePage() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [log, setLog] = useState<ILogEntry[]>([]);
  const [playerInput, setPlayerInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGmThinking, setIsGmThinking] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // Effect for scrolling the log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  // Effect for WebSocket connection management
  useEffect(() => {
    if (!gameId) return;

    // Create WebSocket connection
    ws.current = new WebSocket('ws://127.0.0.1:5001');

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
      // Register this client with the gameId
      const registerMessage = { type: 'register', gameId };
      ws.current?.send(JSON.stringify(registerMessage));
      setIsLoading(false); // No longer loading the game, now waiting for actions
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'log' && message.payload) {
        setLog(prevLog => [...prevLog, message.payload]);
        setIsGmThinking(false); // GM has responded
      } else if (message.type === 'system') {
        console.log('System message:', message.content);
      } else if (message.type === 'error') {
        console.error('WebSocket Error:', message.content);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      setLog(prevLog => [...prevLog, { type: 'system', content: 'Connection to the server has been lost.', timestamp: new Date().toISOString() }]);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setLog(prevLog => [...prevLog, { type: 'system', content: 'A connection error occurred.', timestamp: new Date().toISOString() }]);
    };

    // Cleanup on component unmount or gameId change
    return () => {
      ws.current?.close();
    };
  }, [gameId]);

  const handleStartGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5001/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId: '6697d8f5e3053790532e4804' })
      });
      if (!response.ok) throw new Error('Failed to start game');
      const data = await response.json();
      setLog(data.log);
      setGameId(data._id); // This will trigger the useEffect to connect WebSocket
    } catch (error: any) {
      let message = 'Error: Could not start a new game.';
      if (error instanceof Error) message += ' ' + error.message;
      setLog([{ type: 'system', content: message + ' Is the backend server running?', timestamp: new Date().toISOString() }]);
      setIsLoading(false);
    }
  };

  const handleSendAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInput.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const action = playerInput;
    
    // Optimistically add player action to the log
    const playerEntry: ILogEntry = {
      type: 'player',
      content: action,
      timestamp: new Date().toISOString(),
    };
    setLog(prevLog => [...prevLog, playerEntry]);
    setPlayerInput('');
    setIsGmThinking(true);

    // Send action via WebSocket
    const currentInput = playerInput;
    setPlayerInput('');

    if (currentInput.trim().startsWith('/r ')) {
      const payload = { type: 'manual_roll', payload: { command: currentInput.trim() } };
      ws.current?.send(JSON.stringify(payload));
    } else {
      const payload = { type: 'action', payload: { action: currentInput } };
      ws.current?.send(JSON.stringify(payload));
    }
  };

  const getLogEntryStyle = (type: ILogEntry['type']) => {
    switch (type) {
      case 'narrative':
        return 'text-gray-300 italic';
      case 'player':
        return 'text-blue-400';
      case 'roll':
        return 'text-yellow-400';
      case 'system':
        return 'text-red-500 font-semibold';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="font-sans">
      <header className="bg-gray-800 p-4 shadow-md text-center">
        <h1 className="font-serif text-3xl font-bold text-red-500 tracking-wider">The Adventure Begins</h1>
      </header>

      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {!gameId ? (
            <div className="text-center py-20">
              <h2 className="font-serif text-4xl font-bold mb-4">Ready your Blade</h2>
              <p className="text-lg text-gray-400 mb-8">A new story awaits. What will you do?</p>
              <button 
                onClick={handleStartGame} 
                disabled={isLoading}
                className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Starting...' : 'Start New Game'}
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-inner">
              <div className="h-[60vh] overflow-y-scroll mb-4 pr-2 bg-black bg-opacity-20 rounded-md p-4 font-mono text-sm leading-relaxed">
                {log.map((entry, index) => (
                  <div key={index} className={`mb-3 ${getLogEntryStyle(entry.type)}`}>
                    <span className="opacity-60 mr-2">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                    <span>{entry.content}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
              <form onSubmit={handleSendAction} className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
                  placeholder={isGmThinking ? 'The GM is pondering your fate...' : 'What do you do?'}
                  disabled={isGmThinking}
                />
                <button 
                  type="submit"
                  disabled={isGmThinking || !playerInput.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default GamePage;
