import React, { useState } from "react";
import Welcome from "./components/Welcome";
import Game from "./components/Game";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="app">
      <div className="app-bg" />
      {gameStarted ? (
        <Game onQuit={() => setGameStarted(false)} />
      ) : (
        <Welcome onStart={() => setGameStarted(true)} />
      )}
    </div>
  );
}
