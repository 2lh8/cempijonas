import React from "react";

export default function Welcome({ onStart }) {
  return (
    <div className="welcome">
      <div className="welcome-content">
        <div className="welcome-logo">
          <div className="logo-diamond">
            <span className="logo-text">?</span>
          </div>
        </div>
        <h1 className="welcome-title">Who Wants to Be</h1>
        <h2 className="welcome-subtitle">a Millionaire</h2>
        <p className="welcome-description">
          Answer 15 questions correctly to win <strong>$1,000,000</strong>!
          <br />
          Use your 3 lifelines wisely.
        </p>
        <button className="start-button" onClick={onStart}>
          <span className="start-button-text">Let's Play!</span>
        </button>
        <div className="welcome-rules">
          <h3>Lifelines</h3>
          <div className="rules-grid">
            <div className="rule-item">
              <span className="rule-icon">50:50</span>
              <span className="rule-desc">Remove two wrong answers</span>
            </div>
            <div className="rule-item">
              <span className="rule-icon phone-icon">📞</span>
              <span className="rule-desc">Phone a Friend for help</span>
            </div>
            <div className="rule-item">
              <span className="rule-icon audience-icon">👥</span>
              <span className="rule-desc">Ask the Audience to vote</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
