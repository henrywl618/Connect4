/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  for (let y = 0 ; y < HEIGHT ; y++){
    board.push([]);
    for (let x = 0 ; x < WIDTH ; x++){
      board[y].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  
  const htmlBoard = document.querySelector("#board");
  const topRowContainer = document.querySelector("#topRowContainer")

  // create the top row where pieces will be dropped from
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick); //event listener to handle mouse clicks

  //create # of cells for the top row equal the width of the board and append to the toprow
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);

    //create the pieces that will show in the top row when we hover over it
    const newPiece = document.createElement('div');
    newPiece.classList.add(`piece`,`player${currPlayer}`,'topPiece','hidden');
    headCell.append(newPiece);
    showPiece(headCell); //add eventhandler to the top row to show the piece when we mouseover it

    top.append(headCell); //append the cells to the top row
  }
  topRowContainer.append(top); //append finished top row to the gameboard
  
  

  // create the rest of the gameboard based on width and height of the board
  for (let y = HEIGHT-1; y >=0; y--) { // changed y to start from top so ID of bottom left cell starts at 0-0
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for(y=0 ; y < HEIGHT ; y++){
    if(board[y][x]===null) return y;
  }
  return null;
}


/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  const newPiece = document.createElement('div');
  newPiece.classList.add(`piece`,`player${currPlayer}`);
  document.getElementById(`${y}-${x}`).append(newPiece);
}

/** endGame: announce game end or tie game */

function endGame(msg) {
  if(!alert(msg)) location.reload(); //restart the game when the alert is closed
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  
  if(checkForWin()) return ; 

  // get x from ID of clicked cell
  console.log(evt.target.id);
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // and updates the in memory board array
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    setTimeout(()=>endGame(`Player ${currPlayer} won!`)
    ,500)
    return;
  };

  
  // If the checkTie function returns true, end the game.
  if (checkTie()) setTimeout(endGame('The game is tied!')
  ,500);

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
  evt.target.querySelector('div').classList.replace('player1',`player${currPlayer}`);
  evt.target.querySelector('div').classList.replace('player2',`player${currPlayer}`);
}


// Check for a Tie. Returns false if there are any null values in the board, else returns true. 
function checkTie () {
  for (let y = 0; y < HEIGHT; y++) {
    if(!board[y].every(element => element !== null)){
       return false;
    }
  }
  return true;
}

//Add event listener for mouse over and out on the top colum to show which piece is being played

function showPiece(td){

  td.addEventListener("mouseover", (evt) => {
    evt.target.querySelector('div').classList.replace('player1',`player${currPlayer}`);
    evt.target.querySelector('div').classList.replace('player2',`player${currPlayer}`);
    evt.target.querySelector('div').classList.toggle('hidden');
    console.log(evt.target);
  })
  td.addEventListener("mouseout", (evt) => {
    evt.target.querySelector('div').classList.toggle('hidden');

  })
    /*
    if(evt.target.tagName == 'TD'){
      const newPiece = document.createElement('div');
      newPiece.classList.add(`piece`,`player${currPlayer}`);
      evt.target.append(newPiece);
    }
  });
  td.addEventListener("mouseout", (evt) => {
    console.log(evt.target,"mouseout");
    if(evt.target.tagName == 'TD'){
      evt.target.querySelector('div').remove();
    }
    
  })*/
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  const _win = (cells)=> {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }


  //Loops through each cell and for each cell creates 4 arrays of consecutive cells.
  //Each group of consecutive horizontal, vertical, diagonal left and left cells are 
  //checked to see if each cell in the group are valid cells (within the confines of the board) 
  //and are 4 cells of the current player. Returns true (winner is found) if the _win function returns true
  //for any one group of cells.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) { 
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; 
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
