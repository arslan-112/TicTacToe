function Gameboard(){
    const rows = 3;
    const cols = 3;
    const board = [];


    for(let i=0; i<rows; i++){
        board[i] = [];
        for(let j=0; j<cols; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = ()=> board;

    const dropMark = (row,column,player)=>{
        
        if(board[row][column].getValue() === 0){
            board[row][column].addMark(player);
            return true;
        } else{
            return false;
        }
    };

   
      return {
        getBoard,
        dropMark,
        
      };
}


function Cell(){
    let value = 0;

    const addMark = (symbol)=>{
        value = symbol;
    }

    const getValue = ()=> value;

    return{
        addMark,
        getValue
    };
}

function GameController(p1 = "Player 1",p2 = "Player 2"){
    const board = Gameboard();
    
    const players = [
        {
          name: p1,
          symbol: "X"
        },
        {
          name: p2,
          symbol: "O"
        }
      ];

    let activePlayer = players[0];
    let gameOver = false;

    const switchTurn = () =>{
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;


    const playRound = (row, column) =>{
        if(gameOver) return;
        
          const moveSuccessful = board.dropMark(row, column, getActivePlayer().symbol);

          if (!moveSuccessful) {
              return;
          }

        if(checkWin(board.getBoard(),getActivePlayer().symbol)){
            gameOver = true;
            screenController.endGame(getActivePlayer().name);
            return;
        }
        if (board.getBoard().flat().every(cell => cell.getValue() !== 0)) {
            
            gameOver = true;
            screenController.endGame('tie');
            return;
          }
        
        switchTurn();
        

    }

    

    return{
        playRound,
        getActivePlayer,
        getBoard : board.getBoard
    }; 
}

function checkWin(board, playerToken) {
    const size = board.length; 
  
    // Row Check
    for (let row = 0; row < size; row++) {
      if (board[row].every(cell => cell.getValue() === playerToken)) {
        return true;
      }
    }
  
    // Column Check
    for (let col = 0; col < size; col++) {
      if (board.every(row => row[col].getValue() === playerToken)) {
        return true;
      }
    }
  
    // Diagonal Check (top-left to bottom-right)
    if (board.every((row, index) => row[index].getValue() === playerToken)) {
      return true;
    }
  
    // Diagonal Check (top-right to bottom-left)
    if (board.every((row, index) => row[size - 1 - index].getValue() === playerToken)) {
      return true;
    }
  
    // No win found, return false
    return false;
  }

function ScreenController() {
    let game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    
    const submitButton = document.getElementById('submit');
    const resetButton = document.getElementById('reset');

    let gameOver = false;
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    
  
    const updateScreen = () => {
      
      boardDiv.textContent = "";
  
      // Get the newest version of the board and the active player's turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
  
      if (!gameOver) {
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
      }
  
      // Render board squares
      board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          // Create a button for each cell
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
  
          // Set a data attribute to track row and column for the clicked cell
          cellButton.dataset.row = rowIndex;
          cellButton.dataset.column = colIndex;
  
          // Show the cell's value (X, O, or empty)
          cellButton.textContent = cell.getValue() || '';  // Empty string for 0
  
          // Append the button to the board div
          boardDiv.appendChild(cellButton);
        });
      });
    };
  
    // Handle clicks on the board
    const clickHandlerBoard = (e) => {
      const selectedRow = e.target.dataset.row;
      const selectedColumn = e.target.dataset.column;
  
      // Ensure the click is on a valid cell
      if (selectedRow === undefined || selectedColumn === undefined) return;
  
      // Call `playRound` with row and column
      game.playRound(parseInt(selectedRow), parseInt(selectedColumn));
  
      // Update the screen after the move
      updateScreen();
    };
  

    const endGame = (result) => {
        gameOver = true; // Set game over state to true
        if (result === 'tie') {
            playerTurnDiv.textContent = "It's a tie!";
            playerTurnDiv.classList.add('tie-message');
        } else {
            playerTurnDiv.textContent = `${result} wins :)`;
            playerTurnDiv.classList.add('win-message');
        }
      };
    
    updateScreen();

    const startGame = (p1, p2) => {
        player1Name = p1;
        player2Name = p2;
        game = GameController(p1, p2);
        gameOver = false;
        updateScreen();
        boardDiv.addEventListener("click", clickHandlerBoard);
    };

    const resetGame = () => {
        game = GameController(player1Name, player2Name);
        gameOver = false;
        playerTurnDiv.textContent = "";
        playerTurnDiv.classList.remove('end-message', 'tie-message', 'win-message');
        updateScreen();
    };

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const player1Name = document.getElementById('name1').value;
        const player2Name = document.getElementById('name2').value;
        playerTurnDiv.classList.remove('end-message', 'tie-message', 'win-message');
        startGame(player1Name, player2Name);
    });
    resetButton.addEventListener('click', resetGame);

    startGame(player1Name,player2Name);

      return { endGame };
    }

    
  
    
  
  
// Initialize the ScreenController
const screenController = ScreenController();
  