import React, { useState } from "react";
import Welcome from "./components/Welcome";
import Game from "./components/Game";
import soundManager from "./utils/sounds";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = () => {
    // Play the "let's play" sound and start game
    soundManager.playSFX("letsPlay");
    setGameStarted(true);
  };

  return (
    <div className="app">
      <div className="app-bg" />
      {gameStarted ? (
        <Game onQuit={() => setGameStarted(false)} />
      ) : (
        <Welcome onStart={handleStart} />
      )}
    </div>
  );
}
