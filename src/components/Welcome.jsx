import React, { useState, useEffect, useRef } from "react";
import soundManager from "../utils/sounds";
import titleImage from "../img/cempijonas.png";

const INTRO_LINES = [
  "Šį vakarą – ne šiaip žaidimas.",
  "Tai kelias į šlovę arba į kančią.",
  "Klausimai jos.",
  "Atsakymai tavo.",
  "Kiekvienas atsakymas svarbus.",
  "Kiekviena klaida skauda.",
  "Laikas pradėti...",
];

const INTRO_DURATION_MS = 20000;
const LINE_DURATION_MS = INTRO_DURATION_MS / INTRO_LINES.length;

export default function Welcome({ onStart }) {
  const [introPhase, setIntroPhase] = useState("question"); // 'question' | 'text' | 'revealed'
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const lineTimerRef = useRef(null);

  useEffect(() => {
    if (introPhase !== "text") return;
    soundManager.playBG("mainTheme", false, 800);
    lineTimerRef.current = setInterval(() => {
      setCurrentLineIndex((i) => {
        if (i >= INTRO_LINES.length - 1) {
          if (lineTimerRef.current) clearInterval(lineTimerRef.current);
          soundManager.stopBG(300);
          setIntroPhase("revealed");
          return 0;
        }
        return i + 1;
      });
    }, LINE_DURATION_MS);
    return () => {
      if (lineTimerRef.current) clearInterval(lineTimerRef.current);
    };
  }, [introPhase]);

  useEffect(() => {
    return () => {
      soundManager.stopBG(300);
    };
  }, []);

  const handleIntroClick = () => {
    if (introPhase === "question") setIntroPhase("text");
  };

  const handleSkipIntro = () => {
    if (lineTimerRef.current) {
      clearInterval(lineTimerRef.current);
      lineTimerRef.current = null;
    }
    soundManager.stopBG(300);
    setIntroPhase("revealed");
    setCurrentLineIndex(0);
  };

  return (
    <div className="welcome">
      {introPhase === "text" && (
        <div className="welcome-intro welcome-intro-text">
          <p
            key={currentLineIndex}
            className="welcome-intro-line"
            style={{ animationDuration: `${LINE_DURATION_MS}ms` }}
          >
            {INTRO_LINES[currentLineIndex]}
          </p>
        </div>
      )}
      {introPhase === "question" && (
        <div
          className="welcome-intro"
          onClick={handleIntroClick}
          onKeyDown={(e) => e.key === "Enter" && handleIntroClick()}
          role="button"
          tabIndex={0}
          aria-label="Click to start"
        >
          <span className="welcome-intro-question">?</span>
        </div>
      )}
      <div className="welcome-debug">
        <button type="button" className="debug-menu-btn" onClick={handleSkipIntro}>
          Praleisti įžangą
        </button>
      </div>

      {introPhase === "revealed" && (
        <div className="welcome-content welcome-content-revealed">
          <div className="welcome-title-image-wrap">
            <img
              src={titleImage}
              alt="Čempi-Jonas"
              className="welcome-title-image"
            />
          </div>
          <p className="welcome-note">
            Kiek tu žinai apie Juliją? Įrodyk!
          </p>
          <button className="start-button" onClick={onStart}>
            <span className="start-button-text">Žaidžiam!</span>
          </button>
          <div className="welcome-rules">
            <h3>Pagalbos priemonės</h3>
            <div className="rules-grid">
              <div className="rule-item">
                <span className="rule-icon">50:50</span>
                <span className="rule-desc">Pašalina du neteisingus atsakymus</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon phone-icon">📞</span>
                <span className="rule-desc">Paskambink draugui</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon audience-icon">👥</span>
                <span className="rule-desc">Publikos pagalba</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
