import { useEffect, useState } from "react";
import io from "socket.io-client";
import Cell from "./Components/Cell/Cell";
import "./App.css";

const socket = io.connect("http://localhost:5000");

function App() {
  const [roomCode, setRoomCode] = useState(null);
  const [Winner, setWinner] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState(null);
  const handleSave = () => {
    setRoomCode(roomCodeInput);
  };

  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [canPlay, setCanPlay] = useState(true);

  useEffect(() => {
    socket.on("updateGame", (id) => {
      console.log("use Effect", id);
      setBoard((data) => ({ ...data, [id]: "O" }));
      setCanPlay(true);
      if (Winner == true) {
        alert("Congrats! You are the Winner")
      } else
        alert("Your turn")
    });

    return () => socket.off("updateGame");
  });

  const handleRandomClick = () => {
    function getRandomInt() {
      return Math.floor(Math.random() * 10000);
    }
    alert("Your room code is " + getRandomInt(3) + ". \nShare this Code to play with friends!");
  }

  const handleCellClick = (e) => {
    const id = e.currentTarget.id;
    if (canPlay && board[id] == "") {
      setBoard((data) => ({ ...data, [id]: "X" }));
      socket.emit("play", { id, roomCode });
      setCanPlay(false);
    }

    /*const combinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
*/
    if (
      (board[0] == "X" && board[1] == "X" && board[2] == "X") || //first line
      (board[0] == "O" && board[1] == "O" && board[2] == "O") ||
      (board[3] == "X" && board[4] == "X" && board[5] == "X") ||//second line
      (board[3] == "O" && board[4] == "O" && board[5] == "O") ||
      (board[6] == "X" && board[7] == "X" && board[8] == "X") ||//third line
      (board[6] == "O" && board[7] == "O" && board[8] == "O") ||
      (board[0] == "X" && board[3] == "X" && board[6] == "X") ||//hor 1 line
      (board[0] == "O" && board[3] == "O" && board[6] == "O") ||
      (board[1] == "X" && board[4] == "X" && board[7] == "X") ||//hor 2 line
      (board[1] == "O" && board[4] == "O" && board[7] == "O") ||
      (board[2] == "X" && board[5] == "X" && board[8] == "X") ||//hor 3 line
      (board[2] == "O" && board[5] == "O" && board[8] == "O") ||
      (board[0] == "X" && board[4] == "X" && board[8] == "X") ||//dia 1 line
      (board[0] == "O" && board[4] == "O" && board[8] == "O") ||
      (board[2] == "X" && board[4] == "X" && board[6] == "X") ||//dia 2 line
      (board[2] == "O" && board[4] == "O" && board[6] == "O")
    ) {
      alert("Game Over!")
      setBoard(["", "", "", "", "", "", "", "", ""]);
    }
  };


  useEffect(() => {
    console.log(roomCode);
    if (roomCode) {
      socket.emit("joinRoom", roomCode);
      alert("Entered the Room.\nWaiting for player...");
    }
    setBoard(["", "", "", "", "", "", "", "", ""]);
  }, [roomCode]);

  return (
    <>

      <h1 className="header-title">Multiplayer Tic Tac Toe</h1>
      <p> Enter a room code before you start</p>
      <main>

        <div className="container">

          <h1>Enter a room code</h1>
          <button onClick={handleRandomClick}>Get a Room</button>
          <input
            type="number"
            placeholder="eg: 1212"
            onChange={(e) => setRoomCodeInput(e.target.value)}
          />
          <button onClick={handleSave}>
            Save
          </button>
        </div>


        <section className="main-section">
          <Cell handleCellClick={handleCellClick} id={"0"} text={board[0]} />
          <Cell handleCellClick={handleCellClick} id={"1"} text={board[1]} />
          <Cell handleCellClick={handleCellClick} id={"2"} text={board[2]} />

          <Cell handleCellClick={handleCellClick} id={"3"} text={board[3]} />
          <Cell handleCellClick={handleCellClick} id={"4"} text={board[4]} />
          <Cell handleCellClick={handleCellClick} id={"5"} text={board[5]} />

          <Cell handleCellClick={handleCellClick} id={"6"} text={board[6]} />
          <Cell handleCellClick={handleCellClick} id={"7"} text={board[7]} />
          <Cell handleCellClick={handleCellClick} id={"8"} text={board[8]} />
        </section>
      </main>
    </>
  );
}


export default App;
