import React from "react";
import Card from "./card.js";

function Cards(props) {
  let source1;
  let source2;
  const hasCards = props.player.holeCards.length > 1;

  if (props.player.username === props.name && hasCards) {
    source1 = require("./cards/" +
      props.player.holeCards[0].toUpperCase().replace("T", "10") +
      ".png");
    source2 = require("./cards/" +
      props.player.holeCards[1].toUpperCase().replace("T", "10") +
      ".png");
  } else {
    source1 = require("./cards/blue_back.png");
    source2 = require("./cards/blue_back.png");
  }

  return hasCards ? (
    <div id="cards">
      <Card source={source1} />
      <Card source={source2} />
    </div>
  ) : null;
}
export default Cards;
