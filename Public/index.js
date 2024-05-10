const cells = document.querySelectorAll(".cell");
const bigCells = document.querySelectorAll(".bigCell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const startingBoardIndex = 4;
const activeBoardColor = "#D3D3D3";
const inactiveBoardColor = "white";
const xWinColor="#FFCCCC";
const oWinColor="#CCDDFF";
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = [["", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", ""]];

let bigBoardOptions = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let running = false;

initializeGame();

function initializeGame(){

    let startingBoard = document.getElementById("startingBoard")
    startingBoard.style.backgroundColor=activeBoardColor;
    for (const cell of cells){
        if (cell.parentNode.getAttribute("bigCellIndex")==startingBoardIndex){
            cell.addEventListener("click", cellClicked);
        }
        else{
            cell.removeEventListener("click", cellClicked);
            cell.parentNode.style.backgroundColor=inactiveBoardColor;
        }
    }
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent=`${currentPlayer}'s turn`;
    running=true;
}


function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");
    const bigCellIndex = this.parentNode.getAttribute("bigCellIndex");
    if(options[bigCellIndex][cellIndex] != "" || !running){
        return;
    }
    updateCell(this, cellIndex, bigCellIndex);
    checkBoardWin(bigCellIndex);
    updateListener(bigCellIndex, cellIndex);
}


//10 is an arbitrary index that is out of bounds for bigCells, selected to represent restarting the game and removing all listeners. When 10 is an argument given the next Index must always be 4
//Removes listeners from the inactive sections of the board and adds them to the active section. Changes div color in order to make the active board clear.
function updateListener(index, nextIndex){
    if (bigCells[nextIndex].getAttribute("boardFull")=="True"){
        console.log("Board Full");
        boardFull(nextIndex);
        return;
    }
    if (!index==10){
        let children = bigCells[index].childNodes;
        for (const cell of children){
            cell.removeEventListener("click", cellClicked);
        }
    }else{
        cells.forEach(cell=>cell.removeEventListener("click",cellClicked))
        bigCells.forEach(bigCells=>bigCells.style.backgroundColor=inactiveBoardColor);
    }
    bigCells[nextIndex].style.backgroundColor=activeBoardColor;
    let nextChildren = bigCells[nextIndex].childNodes;
    for (const cell of nextChildren){
        cell.addEventListener("click", cellClicked)
    }
}

function boardFull(fullBoardIndex){
    for (const cell of bigCells){
        if (cell.getAttribute("bigCellIndex")==fullBoardIndex){
            cell.style.backgroundColor=inactiveBoardColor;
            cell.childNodes.forEach(cell=>cell.removeEventListener("click", cellClicked));
        }
        if(cell.getAttribute("boardFull")=="False"){
            cell.style.backgroundColor=activeBoardColor;
            cell.childNodes.forEach(cell=>cell.addEventListener("click", cellClicked));
        }
    }
}

function updateCell(cell, index, bigCellIndex){
    options[bigCellIndex][index]=currentPlayer;
    cell.textContent = currentPlayer;
}


function changePlayer(){
    currentPlayer = (currentPlayer=="X") ? "O" : "X";
    statusText.textContent=`${currentPlayer}'s turn`;
}


function checkBoardWin(bigBoardIndex){
    let boardWon = false;
    let winningPositions = [];
    if (bigCells[bigBoardIndex].getAttribute("boardWon")=="False"){
        for (const condition of winConditions){
            winningPositions=condition;
            const cellA = options[bigBoardIndex][condition[0]];
            const cellB = options[bigBoardIndex][condition[1]];
            const cellC = options[bigBoardIndex][condition[2]];

            if (cellA == "" || cellB == "" || cellC == ""){
                continue;
            }
            if (cellA == cellB && cellB == cellC){
                boardWon=true;
                break;
            }
        }
    }
    if (boardWon){
        bigBoardOptions[bigBoardIndex]=currentPlayer;
        bigCells[bigBoardIndex].setAttribute("boardWon", "True");
        for (const winPosition of winningPositions){
            bigCells[bigBoardIndex].children[winPosition].style.backgroundColor= (currentPlayer=="X") ? xWinColor : oWinColor;
        }
        checkGameOver(bigBoardIndex);
    }else if(!options[bigBoardIndex].includes("")){
        bigCells[bigBoardIndex].setAttribute("boardFull", "True");
    }else{
        changePlayer();
    }
}

function checkGameOver(index){
    let roundWon = false;
    for (const element of winConditions){
        const condition = element;
        const cellA = bigBoardOptions[condition[0]];
        const cellB = bigBoardOptions[condition[1]];
        const cellC = bigBoardOptions[condition[2]];
        if (cellA == "" || cellB == "" || cellC == ""){
            continue
        }
        if (cellA == cellB && cellB == cellC){
            roundWon=true;
            bigBoardOptions[index]=currentPlayer;
            break;
        }
    }
    if (roundWon){
        statusText.textContent = `${currentPlayer} Wins!`;
        running=false;
    }else if(!bigBoardOptions.includes("")){
        statusText.textContent = `Draw!`;
        running=false;
    }else{
        //console.log("Change player")
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = "X"
    options = [["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]];
    bigBoardOptions = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent=`${currentPlayer}'s turn`;
    for (const cell of cells){
        cell.textContent="";
        cell.style.backgroundColor="transparent";
    }
    
    for (const bigCell of bigCells){
        bigCell.setAttribute("boardFull", "False"); 
        bigCell.setAttribute("boardWon", "False");
    }
    initializeGame();
}