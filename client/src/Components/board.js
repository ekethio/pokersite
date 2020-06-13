import React from "react";
import Card from "./card.js";

function Board(props) {
  const board = props.board;

  return board.length > 0 ? (
    <div id="board">
      {" "}
      {board.map((card) => (
        <Card
          source={require("./cards/" +
            card.toUpperCase().replace("T", "10") +
            ".png")}
        />
      ))}
    </div>
  ) : null;
}

export default Board;
