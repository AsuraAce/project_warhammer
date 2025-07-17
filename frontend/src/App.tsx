import { useState, useEffect, useRef } from 'react';

// Matches the backend ILogEntry interface
interface ILogEntry {
  type: 'narrative' | 'player' | 'roll' | 'system';
  content: string;
  timestamp: string;
}

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [log, setLog] = useState<ILogEntry[]>([]);
  const [playerInput, setPlayerInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const handleStartGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5001/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // This characterId is hardcoded for now. We will replace this with a character selection screen later.
          characterId: '6697d8f5e3053790532e4804' 
        })
      });
      if (!response.ok) {
        throw new Error('Failed to start game');
      }
      const data = await response.json();
      setGameId(data._id);
      setLog(data.log);
    } catch (error: any) {
      // --- Enhanced Error Logging ---
      console.error('--- START GAME CATCH BLOCK ---');
      console.error('typeof error:', typeof error);
      console.error('error:', error);
      if (error) {
        console.error('error.message:', error.message);
        console.error('error.name:', error.name);
        console.error('error.stack:', error.stack);
      }
      // --- End Enhanced Error Logging ---

      let message = 'Error: Could not start a new game.';
      if (error instanceof Error) message += ' ' + error.message;
      else if (typeof error === 'object' && error !== null && 'message' in error) message += ' ' + (error as any).message;
      else message += ' ' + JSON.stringify(error);
      
      setLog([{ type: 'system', content: message + ' Is the backend server running?', timestamp: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInput.trim() || !gameId || isLoading) return;

    setIsLoading(true);
    const currentInput = playerInput;
    setPlayerInput('');

    try {
      const response = await fetch(`http://127.0.0.1:5001/api/game/${gameId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: currentInput })
      });
      if (!response.ok) {
        throw new Error('Failed to send action');
      }
      const data = await response.json();
      setLog(data.log);
    } catch (error: any) {
      let message = 'Error: Could not send action.';
      if (error instanceof Error) message += ' ' + error.message;
      else if (typeof error === 'object' && error !== null && 'message' in error) message += ' ' + (error as any).message;
      else message += ' ' + JSON.stringify(error);
      console.error('Send Action Error:', error);
      setLog(prevLog => [...prevLog, { type: 'system', content: message + ' Please try again.', timestamp: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-mono">
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center text-red-500">Warhammer Fantasy Roleplay - LLM GM</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {!gameId ? (
            <div className="text-center">
              <button 
                onClick={handleStartGame} 
                disabled={isLoading}
                className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600"
              >
                {isLoading ? 'Starting...' : 'Start New Game'}
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <div className="h-96 overflow-y-scroll mb-4 pr-2">
                {log.map((entry, index) => (
                  <p key={index} className={`mb-2 ${getLogEntryStyle(entry.type)}`}>
                    <span className="font-bold">[{new Date(entry.timestamp).toLocaleTimeString()}]</span> {entry.content}
                  </p>
                ))}
                <div ref={logEndRef} />
              </div>
              <form onSubmit={handleSendAction}>
                <input 
                  type="text" 
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={isLoading ? 'GM is thinking...' : 'What do you do?'}
                  disabled={isLoading}
                />
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
