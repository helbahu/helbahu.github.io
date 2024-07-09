import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=3, ncols=3, chanceLightStartsOn=0.8 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // TODO: create array-of-arrays of true/false values
    for(let i = 0; i < nrows; i ++){
      const rowArr = []
      for(let j = 0; j < ncols; j++){
        const randomNum = Math.floor(Math.random()*100);
        randomNum < chanceLightStartsOn*100 ? rowArr.push(true): rowArr.push(false);
      }
      initialBoard.push(rowArr);
    }
    return initialBoard;
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    return !board.some(row=> row.some(cell=>cell));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => [...row]);

      // TODO: in the copy, flip this cell and the cells around it
      let aroundCoords =[[y,x-1],[y,x+1],[y-1,x],[y+1,x]];
      aroundCoords = aroundCoords.filter(coord=>{
        if(coord[0] === undefined || coord[1] === undefined ) return false;
        return true;
      })

      flipCell(y,x,boardCopy);
      for(let [y,x] of aroundCoords){
        flipCell(y,x,boardCopy);
      }

      // TODO: return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  // make table board, when game starts.

  return (
    <div className="Board">
      {hasWon() ? <h2>Congratulations! You won.</h2>
      :board.map((row,rowIdx)=> {
        return (
        <div id={`${rowIdx}`}>
          {row.map((cell,cellIdx)=> <Cell flipCellsAroundMe={()=>flipCellsAround(`${rowIdx}-${cellIdx}`)} isLit={cell}/>)}
        </div>
        )
      })}
    </div>
  )

}

export default Board;
