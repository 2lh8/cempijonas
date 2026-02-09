import React from "react";
import { MONEY_LADDER, SAFETY_NETS } from "../data/questions";

const WIN_VIDEO_ID = "ihX6_MAEQeE";
const WIN_VIDEO_EMBED = `https://www.youtube.com/embed/${WIN_VIDEO_ID}?autoplay=1`;

export default function GameOver({ won, level, onRestart }) {
  let prize;
  if (won) {
    prize = MONEY_LADDER[MONEY_LADDER.length - 1];
  } else if (level === 0) {
    prize = "Lygis";
  } else {
    // Rasti aukščiausią pasiektą saugų tašką
    const passedSafetyNets = SAFETY_NETS.filter((net) => net < level);
    if (passedSafetyNets.length > 0) {
      const highestSafetyNet = Math.max(...passedSafetyNets);
      prize = MONEY_LADDER[highestSafetyNet];
    } else {
      prize = "Lygis";
    }
  }

  return (
    <div className="game-over">
      <div className="game-over-content">
        {won ? (
          <>
            <div className="confetti-container">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    backgroundColor: [
                      "#f5a623",
                      "#4fc3f7",
                      "#e91e63",
                      "#4caf50",
                      "#9c27b0",
                      "#ff9800",
                    ][i % 6],
                  }}
                />
              ))}
            </div>
            <h1 className="winner-title">SVEIKINAM!</h1>
            <p className="winner-subtitle">Tu esi tikras</p>
            <h2 className="winner-amount">Čempi-Jonas!</h2>
            <p className="winner-message">Tu tikrai pažįsti Juliją!</p>
            <div className="spotify-widget">
              <div className="spotify-widget-art">
                <iframe
                  title="Čempi-Jonas winner"
                  src={WIN_VIDEO_EMBED}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="spotify-widget-info">
                <span className="spotify-widget-title">Čempi-Jonas</span>
                <span className="spotify-widget-artist">Pergalė</span>
              </div>
            </div>
            <button className="restart-button" onClick={onRestart}>
              Žaisti dar kartą
            </button>
          </>
        ) : (
          <>
            <h1 className="loser-title">Klaida! Laikas skausmui.</h1>
            <div className="loser-prize">
              <span className="prize-label">Išsinešei</span>
              <span className="prize-amount">{prize}</span>
            </div>
            <button className="restart-button" onClick={onRestart}>
              Žaisti dar kartą
            </button>
          </>
        )}
      </div>
    </div>
  );
}
