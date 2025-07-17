import { WebSocketServer, WebSocket } from 'ws';
import { handlePlayerAction, handleManualRoll } from '../controllers/gameController';

// This interface will be used for our structured messages
interface IWebSocketMessage {
    type: 'register' | 'action' | 'error' | 'system' | 'log' | 'narrative' | 'roll' | 'manual_roll';
    gameId?: string;
    payload?: any;
    content?: string;
}

// A map to store active WebSocket connections, keyed by gameId
const gameConnections = new Map<string, WebSocket[]>();

export const initializeWebSocket = (wss: WebSocketServer) => {
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected via WebSocket');
    let associatedGameId: string | null = null;

    ws.on('message', (message: string) => {
        try {
            const data: IWebSocketMessage = JSON.parse(message);

            // The first message from a client must be 'register'
            if (data.type === 'register' && data.gameId) {
                associatedGameId = data.gameId;
                console.log(`WebSocket registered for gameId: ${associatedGameId}`);

                if (!gameConnections.has(associatedGameId)) {
                    gameConnections.set(associatedGameId, []);
                }
                gameConnections.get(associatedGameId)?.push(ws);

                ws.send(JSON.stringify({ type: 'system', content: 'WebSocket connection established and registered.' }));
            
            } else if (data.type === 'action' && associatedGameId && data.payload?.action) {
                // Call the game controller to process the action
                handlePlayerAction(associatedGameId, data.payload.action);
            } else if (data.type === 'manual_roll' && associatedGameId && data.payload?.command) {
                handleManualRoll(associatedGameId, data.payload.command);
            } else {
                 ws.send(JSON.stringify({ type: 'error', content: 'Invalid message or not registered.' }));
            }
        } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
            ws.send(JSON.stringify({ type: 'error', content: 'Invalid message format.' }));
        }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      if (associatedGameId) {
        const connections = gameConnections.get(associatedGameId);
        if (connections) {
            const index = connections.indexOf(ws);
            if (index !== -1) {
                connections.splice(index, 1);
            }
            if (connections.length === 0) {
                gameConnections.delete(associatedGameId);
                console.log(`All connections for game ${associatedGameId} closed. Entry removed.`);
            }
        }
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

// Function to broadcast log entries to all clients in a specific game
export const broadcastLogToGame = (gameId: string, logEntry: object) => {
    const connections = gameConnections.get(gameId);
    if (connections) {
        const message: IWebSocketMessage = {
            type: 'log',
            payload: logEntry
        };
        const payload = JSON.stringify(message);
        connections.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }
};

// A more generic broadcast function if needed later
export const broadcastToGame = (gameId: string, message: object) => {
    const connections = gameConnections.get(gameId);
    if (connections) {
        const payload = JSON.stringify(message);
        connections.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }
};
