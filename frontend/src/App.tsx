import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';
import BestiaryPage from './pages/BestiaryPage';
import CareerPage from './pages/CareerPage';
import LorePage from './pages/LorePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/bestiary" element={<BestiaryPage />} />
            <Route path="/careers" element={<CareerPage />} />
            <Route path="/lore" element={<LorePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

