import React, { useState, useCallback, useRef } from "react";
import questions, { MONEY_LADDER } from "../data/questions";
import Question from "./Question";
import MoneyLadder from "./MoneyLadder";
import Lifelines from "./Lifelines";
import GameOver from "./GameOver";

const LETTERS = ["A", "B", "C", "D"];

export default function Game({ onQuit }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameState, setGameState] = useState("playing"); // playing | won | lost
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [revealState, setRevealState] = useState(null);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  // Lifelines
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [phoneUsed, setPhoneUsed] = useState(false);
  const [audienceUsed, setAudienceUsed] = useState(false);
  const [phoneResult, setPhoneResult] = useState(null);
  const [audienceResult, setAudienceResult] = useState(null);

  const timerRef = useRef(null);

  const currentQuestion = questions[currentLevel];

  const clearLifelineResults = () => {
    setPhoneResult(null);
    setAudienceResult(null);
  };

  const handleAnswer = useCallback(
    (answerIndex) => {
      if (revealState !== null) return;

      setSelectedAnswer(answerIndex);
      setRevealState("selected");

      // After 1.5s, reveal if correct or wrong
      timerRef.current = setTimeout(() => {
        const isCorrect = answerIndex === currentQuestion.correct;

        if (isCorrect) {
          setRevealState("correct");

          // After 1.5s, move to next question or win
          timerRef.current = setTimeout(() => {
            if (currentLevel === questions.length - 1) {
              setGameState("won");
            } else {
              setCurrentLevel((prev) => prev + 1);
              setSelectedAnswer(null);
              setRevealState(null);
              setHiddenOptions([]);
              clearLifelineResults();
            }
          }, 1500);
        } else {
          setRevealState("wrong");

          timerRef.current = setTimeout(() => {
            setGameState("lost");
          }, 2500);
        }
      }, 1500);
    },
    [revealState, currentQuestion, currentLevel]
  );

  const handleFiftyFifty = useCallback(() => {
    if (fiftyFiftyUsed || revealState !== null) return;

    setFiftyFiftyUsed(true);

    const correct = currentQuestion.correct;
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== correct);

    // Randomly pick 2 wrong answers to hide
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, 2);

    setHiddenOptions(toHide);
  }, [fiftyFiftyUsed, revealState, currentQuestion]);

  const handlePhone = useCallback(() => {
    if (phoneUsed || revealState !== null) return;

    setPhoneUsed(true);

    const correct = currentQuestion.correct;
    const confidence = Math.random();

    let suggestedAnswer;
    if (confidence > 0.3) {
      // 70% chance friend suggests correct answer
      suggestedAnswer = correct;
    } else {
      // 30% chance friend suggests wrong answer
      const wrongIndices = [0, 1, 2, 3].filter(
        (i) => i !== correct && !hiddenOptions.includes(i)
      );
      suggestedAnswer =
        wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    }

    const confidenceText =
      confidence > 0.7
        ? "I'm pretty sure"
        : confidence > 0.3
        ? "I think"
        : "I'm not sure, but maybe";

    setPhoneResult(
      `"${confidenceText} the answer is ${LETTERS[suggestedAnswer]}: ${currentQuestion.options[suggestedAnswer]}"`
    );
  }, [phoneUsed, revealState, currentQuestion, hiddenOptions]);

  const handleAudience = useCallback(() => {
    if (audienceUsed || revealState !== null) return;

    setAudienceUsed(true);

    const correct = currentQuestion.correct;
    const percentages = [0, 0, 0, 0];

    // Give correct answer highest percentage (40-70%)
    const correctPct = 40 + Math.floor(Math.random() * 31);
    percentages[correct] = correctPct;

    // Distribute remaining among wrong answers
    let remaining = 100 - correctPct;
    const wrongIndices = [0, 1, 2, 3].filter(
      (i) => i !== correct && !hiddenOptions.includes(i)
    );

    wrongIndices.forEach((idx, i) => {
      if (i === wrongIndices.length - 1) {
        percentages[idx] = remaining;
      } else {
        const pct = Math.floor(Math.random() * remaining);
        percentages[idx] = pct;
        remaining -= pct;
      }
    });

    setAudienceResult(percentages);
  }, [audienceUsed, revealState, currentQuestion, hiddenOptions]);

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentLevel(0);
    setGameState("playing");
    setSelectedAnswer(null);
    setRevealState(null);
    setHiddenOptions([]);
    setFiftyFiftyUsed(false);
    setPhoneUsed(false);
    setAudienceUsed(false);
    clearLifelineResults();
  };

  const handleWalkAway = () => {
    if (revealState !== null) return;
    setGameState("lost");
  };

  if (gameState === "won" || gameState === "lost") {
    return (
      <GameOver
        won={gameState === "won"}
        level={currentLevel}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="game">
      <div className="game-header">
        <Lifelines
          fiftyFiftyUsed={fiftyFiftyUsed}
          phoneUsed={phoneUsed}
          audienceUsed={audienceUsed}
          onFiftyFifty={handleFiftyFifty}
          onPhone={handlePhone}
          onAudience={handleAudience}
          phoneResult={phoneResult}
          audienceResult={audienceResult}
          disabled={revealState !== null}
        />
        <div className="game-actions">
          <span className="current-prize">
            Playing for: <strong>{MONEY_LADDER[currentLevel]}</strong>
          </span>
          <button
            className="walk-away-btn"
            onClick={handleWalkAway}
            disabled={revealState !== null}
          >
            Walk Away
          </button>
        </div>
      </div>

      <div className="game-body">
        <div className="game-main">
          <Question
            question={currentQuestion.question}
            options={currentQuestion.options}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            correctAnswer={currentQuestion.correct}
            revealState={revealState}
            hiddenOptions={hiddenOptions}
          />
        </div>
        <div className="game-sidebar">
          <MoneyLadder currentLevel={currentLevel} />
        </div>
      </div>
    </div>
  );
}
