import React from "react";

function Card(props) {
  return (
    <div className="images">
      <img id="card1" src={props.source} />
    </div>
  );
}

export default Card;
