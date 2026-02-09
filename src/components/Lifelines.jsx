import React from "react";

export default function Lifelines({
  fiftyFiftyUsed,
  phoneUsed,
  audienceUsed,
  onFiftyFifty,
  onPhone,
  onAudience,
  phoneResult,
  disabled,
}) {
  return (
    <div className="lifelines">
      <button
        className={`lifeline-btn ${fiftyFiftyUsed ? "lifeline-used" : ""}`}
        onClick={onFiftyFifty}
        disabled={fiftyFiftyUsed || disabled}
        title="50:50 – Pašalinti du neteisingus atsakymus"
      >
        <span className="lifeline-icon">50:50</span>
      </button>

      <button
        className={`lifeline-btn ${phoneUsed ? "lifeline-used" : ""}`}
        onClick={onPhone}
        disabled={phoneUsed || disabled}
        title="Paskambink draugui"
      >
        <span className="lifeline-icon">📞</span>
      </button>

      <button
        className={`lifeline-btn ${audienceUsed ? "lifeline-used" : ""}`}
        onClick={onAudience}
        disabled={audienceUsed || disabled}
        title="Publikos pagalba"
      >
        <span className="lifeline-icon">👥</span>
      </button>

      {phoneResult && (
        <div className="lifeline-result phone-result">
          <div className="result-header">📞 Draugo atsakymas</div>
          <p>{phoneResult}</p>
        </div>
      )}
    </div>
  );
}
