import React, { useState } from "react";

let hasChanged = false;
let raiseTo;
let amountCall;
let amountRaise;
let minRaise;
function Actions(props) {
  const [betSize, setBetSize] = useState(props.bb);
  let isThereBet;
  if (props.isActing && !hasChanged) {
    raiseTo =
      props.maxWager === props.bb
        ? 2 * props.bb
        : props.maxWager + props.minLegalRaise;
    minRaise = raiseTo;
    amountCall = "Call $" + Math.min(props.player.currentStack, (props.maxWager - props.player.currentWager));
    amountRaise = "Raise to $";
  }
  if (props.player) {
    isThereBet = props.maxWager > props.player.currentWager;
  }
  function handleBet() {
    if (raiseTo < minRaise) {
      alert("You can't raise less than the minimum");
      return;
    }
    if (isThereBet && !hasChanged) {
      props.act("bet", raiseTo - props.player.currentWager);
    } else {
      props.act("bet", betSize);
    }
    hasChanged = false;
  }
  function handleChange(e) {
    if (!isNaN(e.target.value)) {
      raiseTo = Math.min(
        e.target.value,
        props.player.currentStack + props.player.currentWager
      );
      setBetSize(
        Math.min(
          e.target.value - props.player.currentWager,
          props.player.currentStack
        )
      );
    }
    hasChanged = true;
  }
  return props.isActing ? (
    <div className="buttons">
      <button type="button" id="call" onClick={() => props.act("call")}>
        {isThereBet ? amountCall : "Check"}
      </button>
      <button type="button" id="fold" onClick={() => props.act("fold", 0)}>
        Fold
      </button>
      <button type="button" id="bet" onClick={handleBet}>
        {isThereBet ? amountRaise + raiseTo : "Bet " + betSize}
      </button>

      <div id="betInputs">
        <label>
          {isThereBet ? "Raise To:" : "Bet:"}
          <input
            type="text"
            onChange={handleChange}
            id="betInput"
            value={isThereBet ? raiseTo : betSize}
          />
        </label>
        <input
          type="range"
          id="betRange"
          name="betRange"
          value={isThereBet ? raiseTo : betSize}
          step="1"
          min={props.bb}
          max={props.player.currentStack + props.player.currentWager}
          onChange={handleChange}
        />
      </div>
    </div>
  ) : null;
}
export default Actions;
