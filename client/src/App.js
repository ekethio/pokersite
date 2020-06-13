import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Table from "./Components/table.js";
import Player from "./Components/player.js";
import Actions from "./Components/actions.js";
import Board from "./Components/board.js";

const PORT = "http://127.0.0.1:8081";

const socket = socketIOClient(PORT);


function App() {
  console.log('oops');
  const seats = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [players, setPlayers] = useState(
    Object.assign(
      {},
      seats.map((seat) => null)
    )
  );
  const [maxWager, setMaxWager] = useState(0);
  const [minLegalRaise, setMinLegalRaise] = useState(2)
  const [bb, setBb] = useState(2);
  const [board, setBoard] = useState([]);
  const [name, setName] = useState(process.env.user_name);
  const [isActing, setIsActing] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    socket.on("welcome", ({ players, board, bb }) => {
      setPlayers(players);
      setBoard(board);
      setBb(bb);
      const currentPlayers = Object.values(players).filter(
        (player) => player !== null
      );
      const player = currentPlayers.find((player) => player.username === name);
    });

    socket.on("new user", ({ players }) => {
      setPlayers(players);
    });
    socket.on(
      "actionRequested",
      ({ players, board, maxWager,  currentPlayer, minLegalRaise }) => {
        setMaxWager(maxWager);
        setPlayers(players);
        setBoard(board);
        setMinLegalRaise(minLegalRaise);
        const currentPlayers = Object.values(players).filter(
          (player) => player !== null
        );
        const player = currentPlayers.find(
          (player) => player.username === name
        );
        if (player) {
          setIsActing(player.username === currentPlayer);
        }
     
      }
    );
    socket.on("run out", ({ players, board }) => {
      setPlayers(players);
      setBoard(board);
    });
     socket.on("gameEnded", ({ players, board }) => {
      setPlayers(players);
      setBoard(board);
    });
  });

  function add(id,  stack) {
    setName(name);
    socket.emit("join", { seat: id - 1,name: process.env.user_name, buyin: stack });
    setHasJoined(true);
  }
  function act(type, amount) {
    socket.emit("action", {name,  type, amount });
  }
  
  const player = Object.values(players)
    .filter((player) => player !== null)
    .find((p) => p.username === name);
    
  return (
    <div className="container">
      <div className="table">
        <span id="room">
          <i>
            <strong>EkRoom </strong>{" "}
          </i>
        </span>
        {seats.map((seat) => (
          <Player
            id={seat + 1}
            key={seat + 1}
            occupied={players[seat] !== null}
            player={players[seat]}
            add={add}
            hasJoined={hasJoined}
            name={name}
          />
        ))}
        <Board board={board} />
      </div>
      <Actions
        act={act}
        player={player}
        bb={bb}
        isActing={isActing}
        maxWager={maxWager}
        minLegalRaise ={minLegalRaise}
      />
    </div>
  );
}

export default App;
