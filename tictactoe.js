const playerIcons = ['O', 'X']

const humanPlayer = playerIcons[1];
const computerPlayer = playerIcons[0];

let currentPlayer = humanPlayer;

const currentPlayerDOM = document.getElementById('currentPlayer');

const firstRowDOM = document.getElementsByClassName('firstRow');
const secondRowDOM = document.getElementsByClassName('secondRow');
const thirdRowDOM = document.getElementsByClassName('thirdRow');

const firstColumnDOM = document.getElementsByClassName('firstBtn');
const secondColumnDOM = document.getElementsByClassName('secondBtn');
const thirdColumnDOM = document.getElementsByClassName('thirdBtn');

const firstDiagonalDOM = document.getElementsByClassName('diagonalOne');
const secondDiagonalDOM = document.getElementsByClassName('diagonalTwo');

const rowDOMS = [firstRowDOM, secondRowDOM, thirdRowDOM];
const allDOMElements = [
    firstRowDOM, secondRowDOM, thirdRowDOM,
    firstColumnDOM, secondColumnDOM, thirdColumnDOM,
    firstDiagonalDOM, secondDiagonalDOM];

const winnerLineColor = 'red';

let gameState = [
    '_', '_', '_',
    '_', '_', '_',
    '_', '_', '_'
];

let choice;

let gameEnd = false;

function replaceNullWithUnderLine(){
    let j = 0;
    for(let i = 0; i < 9; i = i + 3){
        rowDOMS[j][0].querySelector('.firstBtn').innerHTML = gameState[i];
        rowDOMS[j][0].querySelector('.secondBtn').innerHTML = gameState[i+1];
        rowDOMS[j][0].querySelector('.thirdBtn').innerHTML = gameState[i+2];
        j++;
    }
}

function updateGameState() {
    replaceNullWithUnderLine();

    const rowStates = [
        gameState[0] + gameState[1] + gameState[2],
        gameState[3] + gameState[4] + gameState[5],
        gameState[6] + gameState[7] + gameState[8],
    ];
    const columnStates = [
        gameState[0] + gameState[3] + gameState[6],
        gameState[1] + gameState[4] + gameState [7],
        gameState[2] + gameState[5] + gameState [8]
    ]
    const diagonalStates = [
        gameState[0] + gameState[4] + gameState[8],
        gameState[6] + gameState[4] + gameState[2]
    ]

    const allStates = [...rowStates, ...columnStates, ...diagonalStates];

    if(getAllAvailableMoves(gameState).length === 0){
        currentPlayerDOM.innerHTML = 'No winner!';
        gameEnd = true;
    } else if (allStates.includes('XXX') || allStates.includes('OOO')){
        currentPlayerDOM.innerHTML = 'Winner: ' + currentPlayer;
        drawWinnerLine(allStates);
        gameEnd = true;
    } else {
        const turn = currentPlayer === playerIcons[0] ? playerIcons[1] : playerIcons[0];
        currentPlayerDOM.innerHTML = 'TURN: ' + turn;
    }
}

function drawWinnerLine(allStates){
    const winningStateIndex = allStates.findIndex(element => element === 'XXX' || element === 'OOO');
    const winningStateDOMS = allDOMElements[winningStateIndex].length === 1
        ? allDOMElements[winningStateIndex][0].children
        : allDOMElements[winningStateIndex];
    for(let winningStateDOM of winningStateDOMS){
        winningStateDOM.style.color = winnerLineColor;
    }
}

function minimax(tempGameState, depth) {
    if (checkWinner(tempGameState) !== 0){
        const score = checkWinner(tempGameState);
        if (score === 1){
            return 0;
        } else if (score === 2) {
            return depth-10;
        } else if (score === 3) {
            return 10-depth;
        }
    }

    depth+=1;
    let scores = [], moves = [];
    let availableMoves = getAllAvailableMoves(tempGameState);
    let move, possibility;
    let maxScore, maxScoreIndex, minScore, minScoreIndex;

    for(let i=0; i < availableMoves.length; i++) {
        move = availableMoves[i];
        possibility = generateNewState(move, tempGameState);
        scores.push(minimax(possibility, depth));
        moves.push(move);
        tempGameState = undoMove(tempGameState, move);
    }

    if (currentPlayer !== computerPlayer) {
        maxScore = Math.max.apply(Math, scores);
        maxScoreIndex = scores.indexOf(maxScore);
        choice = moves[maxScoreIndex];
        return scores[maxScoreIndex];
    } else {
        minScore = Math.min.apply(Math, scores);
        minScoreIndex = scores.indexOf(minScore);
        choice = moves[minScoreIndex];
        return scores[minScoreIndex];
    }
}

function checkWinner(tempGameState){
    const rowStates = [
        tempGameState[0] + tempGameState[1] + tempGameState[2],
        tempGameState[3] + tempGameState[4] + tempGameState[5],
        tempGameState[6] + tempGameState[7] + tempGameState[8]
    ];
    const columnStates = [
        tempGameState[0] + tempGameState[3] + tempGameState [6],
        tempGameState[1] + tempGameState[4] + tempGameState [7],
        tempGameState[2] + tempGameState[5] + tempGameState [8]
    ]
    const diagonalStates = [
        tempGameState[0] + tempGameState[4] + tempGameState[8],
        tempGameState[6] + tempGameState[4] + tempGameState[2]
    ]

    const allStates = [...rowStates, ...columnStates, ...diagonalStates];

    if(allStates.includes(humanPlayer[0] + humanPlayer[0] + humanPlayer[0])
        || allStates.includes(computerPlayer[0] + computerPlayer[0] + computerPlayer[0])) {
        if(currentPlayer === computerPlayer){
            return 3;
        }
        return 2;
    }

    if(hasNulls(tempGameState)) {
        return 0;
    }

    return 1;
}

function hasNulls(gameState){
    return gameState.includes('_');
}

function getAllAvailableMoves(currentState) {
    let possibleMoves = [];
    for (let i = 0; i < currentState.length; i++)
        if (currentState[i] === '_'){
            possibleMoves.push(i);
        }
    return possibleMoves;
}

function generateNewState(move, oldState) {
    oldState[move] = changeTurn();
    return oldState;
}

function undoMove(game, move) {
    game[move] = '_';
    changeTurn();
    return game;
}

function changeTurn() {
    if (currentPlayer === computerPlayer) {
        currentPlayer = humanPlayer;
        return humanPlayer;
    }

    currentPlayer = computerPlayer;
    return computerPlayer;
}

function gameBtnClick(btn) {
    if(isNotPressed(btn) && !gameEnd){
        gameState[btn] = currentPlayer;
        updateGameState();
        computerMove();
    }
}

function computerMove(){
    if(!gameEnd){
        minimax(gameState, 0);
        let move = choice;
        gameState[move] = computerPlayer;
        updateGameState();
        currentPlayer = humanPlayer;
        choice = [];
    }
}

function isNotPressed(btn){
    return gameState[btn] !== humanPlayer && gameState[btn] !== computerPlayer;
}

function newGame() {
    location.reload();
}

function initialDraw() {
    updateGameState();
    currentPlayerDOM.innerHTML = 'TURN: ' + currentPlayer;
    if(computerPlayer === currentPlayer){
        computerMove();
    }
}