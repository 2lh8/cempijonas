import React from "react";

export default function Lifelines({
  fiftyFiftyUsed,
  phoneUsed,
  audienceUsed,
  onFiftyFifty,
  onPhone,
  onAudience,
  phoneResult,
  audienceResult,
  disabled,
}) {
  return (
    <div className="lifelines">
      <button
        className={`lifeline-btn ${fiftyFiftyUsed ? "lifeline-used" : ""}`}
        onClick={onFiftyFifty}
        disabled={fiftyFiftyUsed || disabled}
        title="50:50 - Remove two wrong answers"
      >
        <span className="lifeline-icon">50:50</span>
      </button>

      <button
        className={`lifeline-btn ${phoneUsed ? "lifeline-used" : ""}`}
        onClick={onPhone}
        disabled={phoneUsed || disabled}
        title="Phone a Friend"
      >
        <span className="lifeline-icon">📞</span>
      </button>

      <button
        className={`lifeline-btn ${audienceUsed ? "lifeline-used" : ""}`}
        onClick={onAudience}
        disabled={audienceUsed || disabled}
        title="Ask the Audience"
      >
        <span className="lifeline-icon">👥</span>
      </button>

      {phoneResult && (
        <div className="lifeline-result phone-result">
          <div className="result-header">📞 Phone a Friend</div>
          <p>{phoneResult}</p>
        </div>
      )}

      {audienceResult && (
        <div className="lifeline-result audience-result">
          <div className="result-header">👥 Audience Poll</div>
          <div className="audience-bars">
            {audienceResult.map((pct, i) => (
              <div key={i} className="audience-bar-row">
                <span className="bar-letter">{["A", "B", "C", "D"][i]}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <span className="bar-pct">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
