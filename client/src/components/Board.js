import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";

function Board({ result, setResult }) {
  const [board, setBoard] = useState([
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
  ]);

  const [scoreBoard, setScoreBoard] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const [currSection, setCurrSection] = useState(4);

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    checkcurrSectionWin();
    checkIfTie();
    checkWin();
    // eslint-disable-next-line
  }, [board]);

  const chooseSquare = async (square, section) => {
    let freeSpace = board[currSection].includes("");
    if (freeSpace) {
      if (
        turn === player &&
        board[section][square] === "" &&
        currSection === section
      ) {
        setTurn(player === "X" ? "O" : "X");
        setCurrSection(square);
        
        await channel.sendEvent({
          type: "game-move",
          data: { square, player, currSection, freeSpace },
        });

        setBoard(
          board.map((boardSection, boardIdx) => {
            if (boardIdx === currSection) {
              return boardSection.map((val, idx) => {
                if (idx === square && val === "") {
                  return player;
                }
                return val;
              });
            }
            return boardSection;
          })
        );
      }
    } else if (player===turn){
      setTurn(player === "X" ? "O" : "X");
      setCurrSection(square);
      
      await channel.sendEvent({
        type: "game-move",
        data: { square, player, currSection, freeSpace, section },
      });

      setBoard(
        board.map((boardSection, boardIdx) => {
          if (boardIdx === section) {
            return boardSection.map((val, idx) => {
              if (idx === square && val === "") {
                return player;
              }
              return val;
            });
          }
          return boardSection;
        })
      );
    }
  };

  const checkcurrSectionWin = () => {
    if (scoreBoard[currSection] === "") {
      Patterns.forEach((currPattern) => {
        const firstPlayer = board[currSection][currPattern[0]];
        if (firstPlayer === "") return;
        let foundWinningPattern = true;
        currPattern.forEach((idx) => {
          if (board[currSection][idx] !== firstPlayer) {
            foundWinningPattern = false;
          }
        });
        if (foundWinningPattern) {
        }
      });
    }
  };

  //update this with the 2d Array representing the board state
  const checkWin = () => {
    Patterns.forEach((currPattern) => {
      const firstPlayer = scoreBoard[currPattern[0]];
      if (firstPlayer === "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if (scoreBoard[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      });
      if (foundWinningPattern) {
        setResult({ winner: scoreBoard[currPattern[0]], state: "won" });
      }
    });
  };

  const checkIfTie = () => {
    let filled = true;
    scoreBoard.forEach((square) => {
      if (square === "") {
        filled = false;
      }
    });
    if (filled) {
      setResult({ winner: "none", state: "tie" });
    }
  };

  channel.on((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setCurrSection(event.data.square);
      console.log(event.data.freeSpace);
      if (event.data.freeSpace) {
        setBoard(
          board.map((boardSection, boardIdx) => {
            if (boardIdx === event.data.currSection) {
              return boardSection.map((val, idx) => {
                if (idx === event.data.square && val === "") {
                  return event.data.player;
                }
                return val;
              });
            }
            return boardSection;
          })
        );
      } else {
        setBoard(
          board.map((boardSection, boardIdx) => {
            if (boardIdx === event.data.section) {
              return boardSection.map((val, idx) => {
                if (idx === event.data.square && val === "") {
                  return event.data.player;
                }
                return val;
              });
            }
            return boardSection;
          })
        );
      }
      setScoreBoard(
        scoreBoard.map((val, idx) => {
          if (idx === event.data.square && val === "") {
            return event.data.player;
          }
          return val;
        })
      );
    }
  });

  return (
    <div className="boardContainer">
      <div className="boardSection" data-won="false" data-full="false" id="0">
        <Square
          val={board[0][0]}
          chooseSquare={() => {
            chooseSquare(0, 0);
          }}
        />
        <Square
          val={board[0][1]}
          chooseSquare={() => {
            chooseSquare(1, 0);
          }}
        />
        <Square
          val={board[0][2]}
          chooseSquare={() => {
            chooseSquare(2, 0);
          }}
        />
        <Square
          val={board[0][3]}
          chooseSquare={() => {
            chooseSquare(3, 0);
          }}
        />
        <Square
          val={board[0][4]}
          chooseSquare={() => {
            chooseSquare(4, 0);
          }}
        />
        <Square
          val={board[0][5]}
          chooseSquare={() => {
            chooseSquare(5, 0);
          }}
        />
        <Square
          val={board[0][6]}
          chooseSquare={() => {
            chooseSquare(6, 0);
          }}
        />
        <Square
          val={board[0][7]}
          chooseSquare={() => {
            chooseSquare(7, 0);
          }}
        />
        <Square
          val={board[0][8]}
          chooseSquare={() => {
            chooseSquare(8, 0);
          }}
        />
      </div>
      <div className="boardSection" data-won="false" data-full="false" id="1">
        <Square
          val={board[1][0]}
          chooseSquare={() => {
            chooseSquare(0, 1);
          }}
        />
        <Square
          val={board[1][1]}
          chooseSquare={() => {
            chooseSquare(1, 1);
          }}
        />
        <Square
          val={board[1][2]}
          chooseSquare={() => {
            chooseSquare(2, 1);
          }}
        />
        <Square
          val={board[1][3]}
          chooseSquare={() => {
            chooseSquare(3, 1);
          }}
        />
        <Square
          val={board[1][4]}
          chooseSquare={() => {
            chooseSquare(4, 1);
          }}
        />
        <Square
          val={board[1][5]}
          chooseSquare={() => {
            chooseSquare(5, 1);
          }}
        />
        <Square
          val={board[1][6]}
          chooseSquare={() => {
            chooseSquare(6, 1);
          }}
        />
        <Square
          val={board[1][7]}
          chooseSquare={() => {
            chooseSquare(7, 1);
          }}
        />
        <Square
          val={board[1][8]}
          chooseSquare={() => {
            chooseSquare(8, 1);
          }}
        />
      </div>
      <div className="boardSection" data-won="false" data-full="false" id="2">
        <Square
          val={board[2][0]}
          chooseSquare={() => {
            chooseSquare(0, 2);
          }}
        />
        <Square
          val={board[2][1]}
          chooseSquare={() => {
            chooseSquare(1, 2);
          }}
        />
        <Square
          val={board[2][2]}
          chooseSquare={() => {
            chooseSquare(2, 2);
          }}
        />
        <Square
          val={board[2][3]}
          chooseSquare={() => {
            chooseSquare(3, 2);
          }}
        />
        <Square
          val={board[2][4]}
          chooseSquare={() => {
            chooseSquare(4, 2);
          }}
        />
        <Square
          val={board[2][5]}
          chooseSquare={() => {
            chooseSquare(5, 2);
          }}
        />
        <Square
          val={board[2][6]}
          chooseSquare={() => {
            chooseSquare(6, 2);
          }}
        />
        <Square
          val={board[2][7]}
          chooseSquare={() => {
            chooseSquare(7, 2);
          }}
        />
        <Square
          val={board[2][8]}
          chooseSquare={() => {
            chooseSquare(8, 2);
          }}
        />
      </div>
      <div className="boardSection" data-won="false" data-full="false" id="3">
        <Square
          val={board[3][0]}
          chooseSquare={() => {
            chooseSquare(0, 3);
          }}
        />
        <Square
          val={board[3][1]}
          chooseSquare={() => {
            chooseSquare(1, 3);
          }}
        />
        <Square
          val={board[3][2]}
          chooseSquare={() => {
            chooseSquare(2, 3);
          }}
        />
        <Square
          val={board[3][3]}
          chooseSquare={() => {
            chooseSquare(3, 3);
          }}
        />
        <Square
          val={board[3][4]}
          chooseSquare={() => {
            chooseSquare(4, 3);
          }}
        />
        <Square
          val={board[3][5]}
          chooseSquare={() => {
            chooseSquare(5, 3);
          }}
        />
        <Square
          val={board[3][6]}
          chooseSquare={() => {
            chooseSquare(6, 3);
          }}
        />
        <Square
          val={board[3][7]}
          chooseSquare={() => {
            chooseSquare(7, 3);
          }}
        />
        <Square
          val={board[3][8]}
          chooseSquare={() => {
            chooseSquare(8, 3);
          }}
        />
      </div>
      <div className="boardSection" data-won="false" data-full="false" id="4">
        <Square
          val={board[4][0]}
          chooseSquare={() => {
            chooseSquare(0, 4);
          }}
        />
        <Square
          val={board[4][1]}
          chooseSquare={() => {
            chooseSquare(1, 4);
          }}
        />
        <Square
          val={board[4][2]}
          chooseSquare={() => {
            chooseSquare(2, 4);
          }}
        />
        <Square
          val={board[4][3]}
          chooseSquare={() => {
            chooseSquare(3, 4);
          }}
        />
        <Square
          val={board[4][4]}
          chooseSquare={() => {
            chooseSquare(4, 4);
          }}
        />
        <Square
          val={board[4][5]}
          chooseSquare={() => {
            chooseSquare(5, 4);
          }}
        />
        <Square
          val={board[4][6]}
          chooseSquare={() => {
            chooseSquare(6, 4);
          }}
        />
        <Square
          val={board[4][7]}
          chooseSquare={() => {
            chooseSquare(7, 4);
          }}
        />
        <Square
          val={board[4][8]}
          chooseSquare={() => {
            chooseSquare(8, 4);
          }}
        />
      </div>
      <div className="boardSection" data-won="false" data-full="false" id="5">
        <Square
          val={board[5][0]}
          chooseSquare={() => {
            chooseSquare(0, 5);
          }}
        />
        <Square
          val={board[5][1]}
          chooseSquare={() => {
            chooseSquare(1, 5);
          }}
        />
        <Square
          val={board[5][2]}
          chooseSquare={() => {
            chooseSquare(2, 5);
          }}
        />
        <Square
          val={board[5][3]}
          chooseSquare={() => {
            chooseSquare(3, 5);
          }}
        />
        <Square
          val={board[5][4]}
          chooseSquare={() => {
            chooseSquare(4, 5);
          }}
        />
        <Square
          val={board[5][5]}
          chooseSquare={() => {
            chooseSquare(5, 5);
          }}
        />
        <Square
          val={board[5][6]}
          chooseSquare={() => {
            chooseSquare(6, 5);
          }}
        />
        <Square
          val={board[5][7]}
          chooseSquare={() => {
            chooseSquare(7, 5);
          }}
        />
        <Square
          val={board[5][8]}
          chooseSquare={() => {
            chooseSquare(8, 5);
          }}
        />
      </div>
      <div className="boardSection" data-won="false" data-full="false" id="6">
        <Square
          val={board[6][0]}
          chooseSquare={() => {
            chooseSquare(0, 6);
          }}
        />
        <Square
          val={board[6][1]}
          chooseSquare={() => {
            chooseSquare(1, 6);
          }}
        />
        <Square
          val={board[6][2]}
          chooseSquare={() => {
            chooseSquare(2, 6);
          }}
        />
        <Square
          val={board[6][3]}
          chooseSquare={() => {
            chooseSquare(3, 6);
          }}
        />
        <Square
          val={board[6][4]}
          chooseSquare={() => {
            chooseSquare(4, 6);
          }}
        />
        <Square
          val={board[6][5]}
          chooseSquare={() => {
            chooseSquare(5, 6);
          }}
        />
        <Square
          val={board[6][6]}
          chooseSquare={() => {
            chooseSquare(6, 6);
          }}
        />
        <Square
          val={board[6][7]}
          chooseSquare={() => {
            chooseSquare(7, 6);
          }}
        />
        <Square
          val={board[6][8]}
          chooseSquare={() => {
            chooseSquare(8, 6);
          }}
        />
      </div>
      <div className="boardSection" data-won="false" data-full="false" id="7">
        <Square
          val={board[7][0]}
          chooseSquare={() => {
            chooseSquare(0, 7);
          }}
        />
        <Square
          val={board[7][1]}
          chooseSquare={() => {
            chooseSquare(1, 7);
          }}
        />
        <Square
          val={board[7][2]}
          chooseSquare={() => {
            chooseSquare(2, 7);
          }}
        />
        <Square
          val={board[7][3]}
          chooseSquare={() => {
            chooseSquare(3, 7);
          }}
        />
        <Square
          val={board[7][4]}
          chooseSquare={() => {
            chooseSquare(4, 7);
          }}
        />
        <Square
          val={board[7][5]}
          chooseSquare={() => {
            chooseSquare(5, 7);
          }}
        />
        <Square
          val={board[7][6]}
          chooseSquare={() => {
            chooseSquare(6, 7);
          }}
        />
        <Square
          val={board[7][7]}
          chooseSquare={() => {
            chooseSquare(7, 7);
          }}
        />
        <Square
          val={board[7][8]}
          chooseSquare={() => {
            chooseSquare(8, 7);
          }}
        />
      </div>
      <div className="boardSection" data-won="false" data-full="false" id="8">
        <Square
          val={board[8][0]}
          chooseSquare={() => {
            chooseSquare(0, 8);
          }}
        />
        <Square
          val={board[8][1]}
          chooseSquare={() => {
            chooseSquare(1, 8);
          }}
        />
        <Square
          val={board[8][2]}
          chooseSquare={() => {
            chooseSquare(2, 8);
          }}
        />
        <Square
          val={board[8][3]}
          chooseSquare={() => {
            chooseSquare(3, 8);
          }}
        />
        <Square
          val={board[8][4]}
          chooseSquare={() => {
            chooseSquare(4, 8);
          }}
        />
        <Square
          val={board[8][5]}
          chooseSquare={() => {
            chooseSquare(5, 8);
          }}
        />
        <Square
          val={board[8][6]}
          chooseSquare={() => {
            chooseSquare(6, 8);
          }}
        />
        <Square
          val={board[8][7]}
          chooseSquare={() => {
            chooseSquare(7, 8);
          }}
        />
        <Square
          val={board[8][8]}
          chooseSquare={() => {
            chooseSquare(8, 8);
          }}
        />
      </div>
    </div>
  );
}

export default Board;
