/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(color,name){
    this.color = color;
    this.name = name;
  }
  assignColor(element){
    element.style.backgroundColor = `${this.color}`;
  }
}


class Game {
  constructor(width,height,name1,color1,name2,color2){
    this.width = width;
    this.height = height;
    this.player1 = new Player(color1,name1);
    this.player2 = new Player(color2,name2);
    this.currPlayer = this.player1; // active player
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.handleClickBound = this.handleClick.bind(this);
  }

  /*makeBoard: create in-JS board structure:
  board = array of rows, each row is array of cells  (board[y][x])
  This makes an matrix, each element is currently undefined.
 */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width}));
    }
  }

  
  /* makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click',this.handleClickBound);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x){
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /*placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    this.currPlayer.assignColor(piece);
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    document.getElementById(`column-top`).removeEventListener('click', this.handleClickBound);
    setTimeout(() => {
      alert(msg);
    }, 50);

  }

  /*handleClick: handle click of column top to play piece */
  handleClick(evt) {

    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.name} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }
  


  /*Checks if all the cells being checked are for the current player*/
  _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );
  }


  /*checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }


  /*clearBoard will clear all elements in the HTML board*/
  clearBoard(){
    const board = document.getElementById('board');
    board.innerHTML = ``;
    this.currPlayer = this.player1;
    this.board = [];
  }

  startGame() {
    this.clearBoard();
    this.makeBoard();
    this.makeHtmlBoard();
  }


}


document.getElementById(`form`).addEventListener("submit",(e)=>{
  e.preventDefault();
  const table = document.getElementById(`inputTable`).classList;
  if(table.contains(`inactiveTable`)){
    table.remove(`inactiveTable`);
    return;
  } 
  const getVal = id => document.getElementById(`${id}`).value;
  let rows = getVal(`n1`);
  let columns = getVal(`n2`);
  let player1Name = getVal(`player1Name`);
  let player2Name = getVal(`player2Name`);
  let player1Color = getVal(`player1Color`);
  let player2Color = getVal(`player2Color`);

  let newGame = new Game (columns,rows,player1Name,player1Color,player2Name,player2Color);
  newGame.startGame();
  form.reset();
  table.add(`inactiveTable`);
});







