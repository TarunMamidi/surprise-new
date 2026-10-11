
import './App.css';

import { useCallback, useEffect, useState } from 'react';

import FoodAdventures from './components/food/Food';
import Memories from './components/memories/Memories';
import Hero from './components/hero/Hero';
import LoadingScreen from './components/loading/Loading';
import FoodGames from './components/foodgames/FoodGames';
import Butterflies from './components/butterflies/Butterflies';
import Sunflowers from './components/sunflowers/Sunflowers';
import BirthdaySurprise from './components/surprise/BirthdaySurprise';
import MusicPlayer from './components/music/MusicPlayer';
import BalloonSmash from './components/balloon/BalloonSmash';
import SpinWheel from './components/spinwheel/SpinWheel';

function App() {
  const [isloading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const finishLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Keep fullscreen state in sync with the browser.
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  // Toggle browser fullscreen.
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  // Toggle the website theme.
  const toggleDarkMode = () => {
    setIsDarkMode((previousMode) => !previousMode);
  };

  return (
    <div
      className={`birthday-app ${
        isDarkMode ? 'dark-mode' : 'light-mode'
      }`}
    >
      {/* Floating decorations */}
      <Butterflies />
      <Sunflowers />

      {/* Loading screen */}
      {isloading && (
        <LoadingScreen onComplete={finishLoading} />
      )}

      {/* Navigation */}
      <nav className="navbar">
        <a href="#home" className="brand">
          little sunshine <span>☀️</span>
        </a>

        <div className="nav-links">
          <a href="#food-adventures">FoodAdventures 🍕</a>
          <a href="#memories">Memories 📸</a>
          <a href="#food-games">Play our games 🎮</a>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            className="theme-button"
            onClick={toggleDarkMode}
            aria-label={
              isDarkMode
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            aria-pressed={isDarkMode}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          <button
            type="button"
            className="fullscreen-button"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen ⛶'}
          </button>
        </div>
      </nav>

      {/* Main website sections */}
      <main>
        <Hero />
        <FoodAdventures />
        <Memories />
        <BirthdaySurprise />
        <SpinWheel/>
        <FoodGames />
        <MusicPlayer />
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Made with 💛, memories, and a little bit of code.</p>
        <p>For someone who makes life brighter. ♡</p>
      </footer>

      {/* Balloon surprise — render only once */}
      <BalloonSmash />
    </div>
  );
}

export default App;
