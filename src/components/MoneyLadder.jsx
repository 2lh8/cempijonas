import React from "react";
import { MONEY_LADDER, SAFETY_NETS } from "../data/questions";

export default function MoneyLadder({ currentLevel }) {
  return (
    <div className="money-ladder">
      <div className="ladder-list">
        {[...MONEY_LADDER].reverse().map((amount, reversedIndex) => {
          const index = MONEY_LADDER.length - 1 - reversedIndex;
          const isCurrent = index === currentLevel;
          const isPast = index < currentLevel;
          const isSafetyNet = SAFETY_NETS.includes(index);
          const isTopLevel = index === MONEY_LADDER.length - 1;

          const classes = ["ladder-item"];
          if (isCurrent) classes.push("ladder-current");
          if (isPast) classes.push("ladder-past");
          if (isSafetyNet) classes.push("ladder-safety");
          if (isTopLevel) classes.push("ladder-top");

          return (
            <div key={index} className={classes.join(" ")}>
              <span className="ladder-number">{index + 1}</span>
              <span className="ladder-amount">{amount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
