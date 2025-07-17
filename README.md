# WFRP 4e LLM-Driven Adventure Game

This project is a web-based game that recreates a Warhammer Fantasy Roleplay (WFRP) 4th edition-inspired experience using a large language model (LLM) as the game master.

## Tech Stack

- **Frontend**: React.js with Tailwind CSS (served statically)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **LLM**: OpenAI GPT API (or similar)

## Getting Started

1.  **Clone the repository.**
2.  **Backend Setup:**
    - Navigate to the `backend` directory: `cd backend`
    - Install dependencies: `npm install`
    - Create a `.env` file and add your `MONGO_URI`, `JWT_SECRET`, and `OPENAI_API_KEY`.
    - Start the server: `npm start`
3.  **Frontend:**
    - The backend serves the frontend files from the `public` directory.
    - Open your browser and navigate to `http://localhost:5000` (or the port you specified).
