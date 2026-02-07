import React from "react";
import { MONEY_LADDER, SAFETY_NETS } from "../data/questions";

export default function GameOver({ won, level, onRestart }) {
  let prize;
  if (won) {
    prize = MONEY_LADDER[MONEY_LADDER.length - 1];
  } else if (level === 0) {
    prize = "$0";
  } else {
    // Find highest safety net passed
    const passedSafetyNets = SAFETY_NETS.filter((net) => net < level);
    if (passedSafetyNets.length > 0) {
      const highestSafetyNet = Math.max(...passedSafetyNets);
      prize = MONEY_LADDER[highestSafetyNet];
    } else {
      prize = "$0";
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
            <h1 className="winner-title">CONGRATULATIONS!</h1>
            <p className="winner-subtitle">You are a</p>
            <h2 className="winner-amount">MILLIONAIRE!</h2>
            <div className="winner-prize">{prize}</div>
          </>
        ) : (
          <>
            <h1 className="loser-title">Game Over</h1>
            <p className="loser-message">
              You answered incorrectly on question {level + 1}.
            </p>
            <div className="loser-prize">
              <span className="prize-label">You walk away with</span>
              <span className="prize-amount">{prize}</span>
            </div>
          </>
        )}
        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}
