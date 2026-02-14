import React, { useState, useCallback, useRef, useEffect } from "react";
import questions from "../data/questions";
import Question from "./Question";
import MoneyLadder from "./MoneyLadder";
import Lifelines from "./Lifelines";
import GameOver from "./GameOver";
import soundManager, { getBGKeyForLevel } from "../utils/sounds";
import megajonasImg from "../img/megajonas-nobg.png";

const LETTERS = ["A", "B", "C", "D"];

export default function Game({ onQuit }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameState, setGameState] = useState("playing"); // playing | won | lost
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [revealState, setRevealState] = useState(null);
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [transitionPhase, setTransitionPhase] = useState(null); // null | "fadeOut" | "fadeIn"
  const [showWrongContinue, setShowWrongContinue] = useState(false);

  // Pagalbos priemonės
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [phoneUsed, setPhoneUsed] = useState(false);
  const [audienceUsed, setAudienceUsed] = useState(false);
  const [phoneResult, setPhoneResult] = useState(null);

  // Phone a friend modal: 45s countdown, lifeline music starts at 42s left
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneCallStarted, setPhoneCallStarted] = useState(false);
  const [phoneCallSecondsLeft, setPhoneCallSecondsLeft] = useState(45);

  // Ask the audience: same flow – 45s countdown, same lifeline music from 42s
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [audienceCallStarted, setAudienceCallStarted] = useState(false);
  const [audienceCallSecondsLeft, setAudienceCallSecondsLeft] = useState(45);

  const timerRef = useRef(null);
  const phoneCountdownRef = useRef(null);
  const phoneEndTimeoutRef = useRef(null);
  const endPhoneCallRef = useRef(null);
  const audienceCountdownRef = useRef(null);
  const audienceEndTimeoutRef = useRef(null);
  const endAudienceCallRef = useRef(null);

  const currentQuestion = questions[currentLevel];

  // Start BG only on initial load (level 0). After each correct answer, BG is started only by the delayed playBG in handleAnswer, so we never overlap.
  useEffect(() => {
    if (gameState === "playing" && currentLevel === 0) {
      const bgKey = getBGKeyForLevel(0);
      soundManager.playBG(bgKey, true);
    }
  }, [gameState]);

  // Sustabdyti foninę muziką pasibaigus žaidimui
  useEffect(() => {
    if (gameState !== "playing") {
      soundManager.stopBG(800);
    }
  }, [gameState]);

  // Klaida modal: groti „ask the host“
  useEffect(() => {
    if (showWrongContinue) {
      soundManager.playSFX("askTheHost");
    }
  }, [showWrongContinue]);

  const clearLifelineResults = () => {
    setPhoneResult(null);
  };

  const handleAnswer = useCallback(
    (answerIndex) => {
      if (revealState !== null) return;

      setSelectedAnswer(answerIndex);
      setRevealState("selected");

      // „Galutinis atsakymas" – įtampos garsas
      soundManager.stopBG(500);
      soundManager.playSFX("finalAnswer");

      // Po 5s – atskleisti, ar teisinga, ar ne
      timerRef.current = setTimeout(() => {
        const isCorrect = answerIndex === currentQuestion.correct;

        if (isCorrect) {
          setRevealState("correct");
          soundManager.stopSFX("finalAnswer");
          soundManager.playSFX("correctAnswer");

          // Po 5s – fade out atsakymo garsas ir parinktys 1.5s, tada pop-in kitas klausimas
          timerRef.current = setTimeout(() => {
            setTransitionPhase("fadeOut");
            soundManager.stopSFX("correctAnswer", 1500);

            timerRef.current = setTimeout(() => {
              if (currentLevel === questions.length - 1) {
                setGameState("won");
              } else {
                const nextLevel = currentLevel + 1;
                setCurrentLevel((prev) => prev + 1);
                setSelectedAnswer(null);
                setRevealState(null);
                setHiddenOptions([]);
                clearLifelineResults();
                setTransitionPhase("fadeIn");
                timerRef.current = setTimeout(() => setTransitionPhase(null), 400);
                // Po „next question“ garsų – fonas su fade-in (2s delay, 1.5s fade)
                const bgKey = getBGKeyForLevel(nextLevel);
                setTimeout(() => soundManager.playBG(bgKey, true, 1500), 2000);
              }
            }, 1500);
          }, 5000);
        } else {
          setRevealState("wrong");
          soundManager.stopSFX("finalAnswer");
          soundManager.playSFX("wrongAnswer");

          timerRef.current = setTimeout(() => {
            soundManager.stopSFX("wrongAnswer", 1500);
            setShowWrongContinue(true);
          }, 2500);
        }
      }, 5000);
    },
    [revealState, currentQuestion, currentLevel]
  );

  const handleFiftyFifty = useCallback(() => {
    if (fiftyFiftyUsed || revealState !== null) return;

    setFiftyFiftyUsed(true);
    soundManager.stopBG(400);
    soundManager.playSFX("fiftyFifty");

    const correct = currentQuestion.correct;
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== correct);

    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, 2);

    setHiddenOptions(toHide);
  }, [fiftyFiftyUsed, revealState, currentQuestion]);

  const endPhoneCall = useCallback((playEndSound = false) => {
    if (phoneCountdownRef.current) {
      clearInterval(phoneCountdownRef.current);
      phoneCountdownRef.current = null;
    }
    if (phoneEndTimeoutRef.current) {
      clearTimeout(phoneEndTimeoutRef.current);
      phoneEndTimeoutRef.current = null;
    }
    soundManager.stopPhoneAFriendLoop(400);
    if (playEndSound) soundManager.playSFXFrom("phoneAFriend", 42);
    setPhoneUsed(true);
    setShowPhoneModal(false);
    setPhoneCallStarted(false);
    setPhoneCallSecondsLeft(45);
    const bgKey = getBGKeyForLevel(currentLevel);
    soundManager.playBG(bgKey, true, 500);
  }, [currentLevel]);

  endPhoneCallRef.current = endPhoneCall;

  useEffect(() => {
    if (!phoneCallStarted || !showPhoneModal) return;
    setPhoneCallSecondsLeft(45);
    phoneCountdownRef.current = setInterval(() => {
      setPhoneCallSecondsLeft((prev) => {
        if (prev === 43) soundManager.playPhoneAFriendLoop();
        if (prev === 1) return 0;
        if (prev === 0) {
          if (phoneCountdownRef.current) {
            clearInterval(phoneCountdownRef.current);
            phoneCountdownRef.current = null;
          }
          phoneEndTimeoutRef.current = setTimeout(() => {
            phoneEndTimeoutRef.current = null;
            endPhoneCallRef.current?.();
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (phoneCountdownRef.current) {
        clearInterval(phoneCountdownRef.current);
        phoneCountdownRef.current = null;
      }
      if (phoneEndTimeoutRef.current) {
        clearTimeout(phoneEndTimeoutRef.current);
        phoneEndTimeoutRef.current = null;
      }
    };
  }, [phoneCallStarted, showPhoneModal]);

  const handlePhone = useCallback(() => {
    if (phoneUsed || revealState !== null) return;
    setShowPhoneModal(true);
    setPhoneCallStarted(false);
    setPhoneCallSecondsLeft(45);
  }, [phoneUsed, revealState]);

  const handlePhoneStartCall = useCallback(() => {
    soundManager.stopBG(400);
    soundManager.playSFX("letsPlay");
    setPhoneCallStarted(true);
  }, []);

  const handlePhoneCancel = useCallback(() => {
    setShowPhoneModal(false);
    setPhoneCallStarted(false);
    setPhoneCallSecondsLeft(45);
  }, []);

  const endAudienceCall = useCallback((playEndSound = false) => {
    if (audienceCountdownRef.current) {
      clearInterval(audienceCountdownRef.current);
      audienceCountdownRef.current = null;
    }
    if (audienceEndTimeoutRef.current) {
      clearTimeout(audienceEndTimeoutRef.current);
      audienceEndTimeoutRef.current = null;
    }
    soundManager.stopPhoneAFriendLoop(400);
    if (playEndSound) soundManager.playSFXFrom("phoneAFriend", 42);
    setAudienceUsed(true);
    setShowAudienceModal(false);
    setAudienceCallStarted(false);
    setAudienceCallSecondsLeft(45);
    const bgKey = getBGKeyForLevel(currentLevel);
    soundManager.playBG(bgKey, true, 500);
  }, [currentLevel]);

  endAudienceCallRef.current = endAudienceCall;

  useEffect(() => {
    if (!audienceCallStarted || !showAudienceModal) return;
    setAudienceCallSecondsLeft(45);
    audienceCountdownRef.current = setInterval(() => {
      setAudienceCallSecondsLeft((prev) => {
        if (prev === 43) soundManager.playPhoneAFriendLoop();
        if (prev === 1) return 0;
        if (prev === 0) {
          if (audienceCountdownRef.current) {
            clearInterval(audienceCountdownRef.current);
            audienceCountdownRef.current = null;
          }
          audienceEndTimeoutRef.current = setTimeout(() => {
            audienceEndTimeoutRef.current = null;
            endAudienceCallRef.current?.();
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (audienceCountdownRef.current) {
        clearInterval(audienceCountdownRef.current);
        audienceCountdownRef.current = null;
      }
      if (audienceEndTimeoutRef.current) {
        clearTimeout(audienceEndTimeoutRef.current);
        audienceEndTimeoutRef.current = null;
      }
    };
  }, [audienceCallStarted, showAudienceModal]);

  const handleAudience = useCallback(() => {
    if (audienceUsed || revealState !== null) return;
    setShowAudienceModal(true);
    setAudienceCallStarted(false);
    setAudienceCallSecondsLeft(45);
  }, [audienceUsed, revealState]);

  const handleAudienceStart = useCallback(() => {
    soundManager.stopBG(400);
    soundManager.playSFX("letsPlay");
    setAudienceCallStarted(true);
  }, []);

  const handleAudienceCancel = useCallback(() => {
    setShowAudienceModal(false);
    setAudienceCallStarted(false);
    setAudienceCallSecondsLeft(45);
  }, []);

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (phoneCountdownRef.current) {
      clearInterval(phoneCountdownRef.current);
      phoneCountdownRef.current = null;
    }
    if (phoneEndTimeoutRef.current) {
      clearTimeout(phoneEndTimeoutRef.current);
      phoneEndTimeoutRef.current = null;
    }
    if (audienceCountdownRef.current) {
      clearInterval(audienceCountdownRef.current);
      audienceCountdownRef.current = null;
    }
    if (audienceEndTimeoutRef.current) {
      clearTimeout(audienceEndTimeoutRef.current);
      audienceEndTimeoutRef.current = null;
    }
    soundManager.stopAll();
    setCurrentLevel(0);
    setGameState("playing");
    setSelectedAnswer(null);
    setRevealState(null);
    setHiddenOptions([]);
    setTransitionPhase(null);
    setShowWrongContinue(false);
    setShowPhoneModal(false);
    setPhoneCallStarted(false);
    setPhoneCallSecondsLeft(45);
    setShowAudienceModal(false);
    setAudienceCallStarted(false);
    setAudienceCallSecondsLeft(45);
    setFiftyFiftyUsed(false);
    setPhoneUsed(false);
    setAudienceUsed(false);
    clearLifelineResults();
  };

  const handleDepiliuoti = () => {
    setShowWrongContinue(false);
    const nextLevel = currentLevel + 1;
    if (nextLevel >= questions.length) {
      setGameState("lost");
      return;
    }
    setCurrentLevel(nextLevel);
    setSelectedAnswer(null);
    setRevealState(null);
    setHiddenOptions([]);
    clearLifelineResults();
    const bgKey = getBGKeyForLevel(nextLevel);
    soundManager.playBG(bgKey, true);
  };

  const handleDebugResetLifelines = () => {
    if (phoneCountdownRef.current) {
      clearInterval(phoneCountdownRef.current);
      phoneCountdownRef.current = null;
    }
    if (phoneEndTimeoutRef.current) {
      clearTimeout(phoneEndTimeoutRef.current);
      phoneEndTimeoutRef.current = null;
    }
    if (audienceCountdownRef.current) {
      clearInterval(audienceCountdownRef.current);
      audienceCountdownRef.current = null;
    }
    if (audienceEndTimeoutRef.current) {
      clearTimeout(audienceEndTimeoutRef.current);
      audienceEndTimeoutRef.current = null;
    }
    soundManager.stopPhoneAFriendLoop(200);
    setFiftyFiftyUsed(false);
    setPhoneUsed(false);
    setAudienceUsed(false);
    setPhoneResult(null);
    setHiddenOptions([]);
    setShowPhoneModal(false);
    setPhoneCallStarted(false);
    setPhoneCallSecondsLeft(45);
    setShowAudienceModal(false);
    setAudienceCallStarted(false);
    setAudienceCallSecondsLeft(45);
  };

  const handleDebugSkipQuestion = () => {
    if (currentLevel >= questions.length - 1) {
      setGameState("won");
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentLevel((prev) => prev + 1);
    setSelectedAnswer(null);
    setRevealState(null);
    setHiddenOptions([]);
    clearLifelineResults();
    const nextLevel = currentLevel + 1;
    const bgKey = getBGKeyForLevel(nextLevel);
    soundManager.playBG(bgKey, true);
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
          disabled={revealState !== null || showPhoneModal || showAudienceModal}
        />
      </div>

      {showPhoneModal && (
        <div className="phone-call-overlay">
          <div className="phone-call-content">
            {!phoneCallStarted ? (
              <>
                <h2 className="phone-call-title">Paskambink draugui</h2>
                <button
                  className="wrong-continue-btn phone-call-btn"
                  onClick={handlePhoneStartCall}
                >
                  Pradėti skambutį
                </button>
                <button
                  className="phone-call-cancel-btn"
                  onClick={handlePhoneCancel}
                >
                  Atšaukti
                </button>
              </>
            ) : (
              <>
                <h2 className="phone-call-title">Liko kalbėti</h2>
                <div className="phone-call-countdown">{phoneCallSecondsLeft}s</div>
                <button
                  className="wrong-continue-btn phone-call-btn"
                  onClick={() => endPhoneCall(true)}
                >
                  Baigti skambutį
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showAudienceModal && (
        <div className="phone-call-overlay">
          <div className="phone-call-content">
            {!audienceCallStarted ? (
              <>
                <h2 className="phone-call-title">Paklausk publikos</h2>
                <button
                  className="wrong-continue-btn phone-call-btn"
                  onClick={handleAudienceStart}
                >
                  Pradėti
                </button>
                <button
                  className="phone-call-cancel-btn"
                  onClick={handleAudienceCancel}
                >
                  Atšaukti
                </button>
              </>
            ) : (
              <>
                <h2 className="phone-call-title">Konsultacija su publika</h2>
                <div className="phone-call-countdown">{audienceCallSecondsLeft}s</div>
                <button
                  className="wrong-continue-btn phone-call-btn"
                  onClick={() => endAudienceCall(true)}
                >
                  Baigti
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showWrongContinue && (
        <div className="wrong-continue-overlay">
          <div className="wrong-continue-bg-image" aria-hidden="true">
            <img src={megajonasImg} alt="" />
          </div>
          <div className="wrong-continue-content">
            <h2 className="wrong-continue-title">Klaida! Laikas skausmui.</h2>
            <button className="wrong-continue-btn" onClick={handleDepiliuoti}>
              Depiliuoti
            </button>
          </div>
        </div>
      )}
      <div className="debug-menu">
        <button type="button" className="debug-menu-btn" onClick={handleDebugResetLifelines}>
          Grąžinti pagalbas
        </button>
        <button type="button" className="debug-menu-btn" onClick={handleDebugSkipQuestion}>
          Praleisti klausimą
        </button>
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
            isTransitioningOut={transitionPhase === "fadeOut"}
            animateIn={transitionPhase === "fadeIn"}
            isFirstQuestion={currentLevel === 0}
          />
        </div>
        <div className="game-sidebar">
          <MoneyLadder currentLevel={currentLevel} />
        </div>
      </div>
    </div>
  );
}
