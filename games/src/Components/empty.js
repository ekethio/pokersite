import React from "react";

function Empty(props) {
  return (
    <div className="player" id={"player" + props.id}>
      <button
        id={"emptySeat" + props.id}
        type="button"
        onClick={props.seatPlayer}
      >
        Take Seat {props.id}{" "}
      </button>
    </div>
  );
}
export default Empty;
