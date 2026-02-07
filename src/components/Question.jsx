import React from "react";

const LETTERS = ["A", "B", "C", "D"];

export default function Question({
  question,
  options,
  onAnswer,
  selectedAnswer,
  correctAnswer,
  revealState, // null | "selected" | "correct" | "wrong"
  hiddenOptions,
}) {
  const getOptionClass = (index) => {
    const classes = ["option"];

    if (hiddenOptions.includes(index)) {
      classes.push("option-hidden");
    }

    if (revealState && selectedAnswer === index) {
      if (revealState === "selected") {
        classes.push("option-selected");
      } else if (revealState === "correct") {
        classes.push("option-correct");
      } else if (revealState === "wrong") {
        classes.push("option-wrong");
      }
    }

    if (
      revealState === "wrong" &&
      correctAnswer === index &&
      selectedAnswer !== index
    ) {
      classes.push("option-correct");
    }

    return classes.join(" ");
  };

  const isDisabled = revealState !== null;

  return (
    <div className="question-container">
      <div className="question-box">
        <p className="question-text">{question}</p>
      </div>
      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(index)}
            onClick={() => !isDisabled && !hiddenOptions.includes(index) && onAnswer(index)}
            disabled={isDisabled || hiddenOptions.includes(index)}
          >
            <span className="option-letter">{LETTERS[index]}:</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
