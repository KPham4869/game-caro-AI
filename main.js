const musicStart = document.getElementById("start-music");
const musicPause = document.getElementById("pause-music");
let isLock = false;
let isPlayer = true;
let cellsWin = [];
let count = 0;
let countX;
let timerX;
let timerO;
let totalSecondsX = 60;
let totalSecondsO = 60;
let currentPlayer = "X";



let selectOptionsPlayer = document.getElementById('select-player');

let valueOptionsPlayer = selectOptionsPlayer.value;
selectOptionsPlayer.addEventListener('change', function (param) {
    valueOptionsPlayer = param.target.value;
});

let selectOptionsTable = document.getElementById('select-table');
let valueOptionTable = selectOptionsTable.value;
selectOptionsTable.addEventListener('change', function (event) {
valueOptionTable = parseInt(event.target.value);
array = createEmptyBoard(valueOptionTable);
    resetGame()
    display();
});
let array = createEmptyBoard(valueOptionTable);
function createEmptyBoard(size) {
    let newArray = new Array(size);
    for (let i = 0; i < size; i++) {
        newArray[i] = new Array(size).fill(' ');
    }
    return newArray;
}


// Hàm hiển thị bàn cờ
function display() {
    let tableString = `<table>`;
    for (let i = 0; i < valueOptionTable; i++) {
        tableString += `<tr>`;
        for (let j = 0; j < valueOptionTable; j++) {
            if (cellsWin.includes(`${i}-${j}`)) {
                if (array[i][j] === "X") {
                    tableString += `<td style="color: blue; background-color: lightgreen;" onclick="play(${i},${j})">${array[i][j]}</td>`;
                } else if (array[i][j] === "O") {
                    tableString += `<td style="color: red; background-color: lightgreen;" onclick="play(${i},${j})">${array[i][j]}</td>`;
                } else {
                    tableString += `<td onclick="play(${i},${j})">${array[i][j]}</td>`;
                }
            } else {
                if (array[i][j] === "X") {
                    tableString += `<td style="color:blue;" onclick="play(${i},${j})">${array[i][j]}</td>`;
                } else if (array[i][j] === "O") {
                    tableString += `<td style="color:red;" onclick="play(${i},${j})">${array[i][j]}</td>`;
                } else {
                    tableString += `<td onclick="play(${i},${j})">${array[i][j]}</td>`;
                }
            }
        }
        tableString += `</tr>`;
    }
    tableString += `</table>`;
    document.getElementById("table").innerHTML = tableString;
}

function resetGame() {
    isLock = false;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            array[i][j] = " ";
        }
    }
    isPlayer = true;
    cellsWin = [];
    count = 0;
    display();
    swapPlayer();
}

function play(i, j) {
    if (isLock === false) {

        if (valueOptionsPlayer === 'PS') {
            if (checkisEmpty(i, j)) {
                if (isPlayer) {
                    array[i][j] = "X";
                    checkWinnerPlayer("X");
                    isPlayer = false;
                    count++;
                    stopTimer("X");
                    resetTimer("O");
                    if (cellsWin.includes(`${i}-${j}`)) {
                        if (array[i][j] === "X") {
                            musicStart.pause();
                            musicPause.play();
                            alert('X thắng');
                            isLock = true;
                            stopTimer();
                        }
                    }
                } else {
                    array[i][j] = "O";
                    checkWinnerPlayer("O");
                    isPlayer = true;
                    count++;
                    stopTimer("O");
                    resetTimer("X");
                    if (cellsWin.includes(`${i}-${j}`)) {
                        if (array[i][j] === "O") {
                            musicStart.pause();
                            musicPause.play();
                            alert('O thắng');
                            isLock = true;
                            stopTimer();
                        }
                    }
                }
                swapPlayer();
            } else {
                alert('Ô này đã được đánh rồi !!!');
            }
        } else if (valueOptionsPlayer === 'AI') {

            if (array[i][j] === ' ') {
                array[i][j] = currentPlayer;
                if (checkWin(currentPlayer)) {
                    alert(currentPlayer + " thắng!");
                    array = createEmptyBoard(valueOptionTable);
                } else if (isBoardFull()) {
                    alert("Hòa!");
                } else {
                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                    if (currentPlayer === "O") {
                        let bestMove = findBestMove(array, "O");
                        array[bestMove.row][bestMove.col] = "O";
                        if (checkWin("O")) {
                            alert("O thắng!");
                        } else if (isBoardFull()) {
                            alert("Hòa!");
                        }
                        currentPlayer = "X";
                    }
                }
                display();
            }
        } else {
            alert('Vui lòng chọn chế độ chơi.');
        }
    } else if (isLock === true) {
        alert('Trò chơi đã kết thúc.');
    }

    if (count === valueOptionTable ** 2) {
        alert("Trò chơi hòa!");
        musicPause.play();
    }

    display();
}

function isBoardFull() {
    for (let i = 0; i < valueOptionTable; i++) {
        for (let j = 0; j < valueOptionTable; j++) {
            if (array[i][j] === ' ') {
                return false;
            }
        }
    }
    return true;
}

function checkWin(player) {
    if (valueOptionTable === 5) { // Check win 3 ô liên tiếp
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                let checkNB = array[i][j] === player && array[i + 1][j] === player && array[i + 2][j] === player;
                let checkDT = array[i][j] === player && array[i][j + 1] === player && array[i][j + 2] === player;
                let checkBBNN = array[i][j] === player && array[i + 1][j + 1] === player && array[i + 2][j + 2] === player;
                let checkDDTT = array[i][j] === player && array[i + 1][j - 1] === player && array[i + 2][j - 2] === player;
                if (checkNB || checkDT || checkBBNN || checkDDTT) {
                    return true;
                }
            }
        }
    } else { // Check win 5 ô liên tiếp
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                let checkNB = array[i][j] === player && array[i + 1][j] === player && array[i + 2][j] === player && array[i + 3][j] === player && array[i + 4][j] === player;
                let checkDT = array[i][j] === player && array[i][j + 1] === player && array[i][j + 2] === player && array[i][j + 3] === player && array[i][j + 4] === player;
                let checkBBNN = array[i][j] === player && array[i + 1][j + 1] === player && array[i + 2][j + 2] === player && array[i + 3][j + 3] === player && array[i + 4][j + 4] === player;
                let checkDDTT = array[i][j] === player && array[i + 1][j - 1] === player && array[i + 2][j - 2] === player && array[i + 3][j - 3] === player && array[i + 4][j - 4] === player;
                if (checkNB || checkDT || checkBBNN || checkDDTT) {
                    return true;
                }
            }
        }
    }
    return false;
}


function findBestMove(board, player) {
    let bestVal = -Infinity;
    let bestMove = { row: -1, col: -1 };
    let moves = generateMoves(board);

    for (let move of moves) {
        board[move.row][move.col] = player;
        let moveVal = minimax(board, 0, false, player, -Infinity, Infinity, 3); // Giới hạn độ sâu là 3
        board[move.row][move.col] = ' ';
        if (moveVal > bestVal) {
            bestMove = move;
            bestVal = moveVal;
        }
    }
    return bestMove;
}

function minimax(board, depth, isMax, player, alpha, beta, maxDepth) {
    let score = evaluate(board, player);

    // Điều kiện dừng đệ quy
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (isBoardFull() || depth === maxDepth) return 0;

    let best;
    if (isMax) {
        best = -Infinity;
        let moves = generateMoves(board);
        for (let move of moves) {
            board[move.row][move.col] = player;
            best = Math.max(best, minimax(board, depth + 1, !isMax, player, alpha, beta, maxDepth));
            board[move.row][move.col] = ' ';
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break;
        }
    } else {
        best = Infinity;
        let moves = generateMoves(board);
        for (let move of moves) {
            board[move.row][move.col] = player === "O" ? "X" : "O";
            best = Math.min(best, minimax(board, depth + 1, !isMax, player, alpha, beta, maxDepth));
            board[move.row][move.col] = ' ';
            beta = Math.min(beta, best);
            if (beta <= alpha) break;
        }
    }
    return best;
}

function generateMoves(board) {
    let moves = [];
    let size = board.length;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] !== ' ') continue;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue;
                    let ni = i + x, nj = j + y;
                    if (ni >= 0 && ni < size && nj >= 0 && nj < size && board[ni][nj] !== ' ') {
                        moves.push({ row: i, col: j });
                        x = y = 1; // Break out of both loops
                    }
                }
            }
        }
    }
    return moves.length > 0 ? moves : [{ row: Math.floor(size / 2), col: Math.floor(size / 2) }];
}

function evaluate(board, player) {
    let opponent = player === "O" ? "X" : "O";

    // Kiểm tra hàng ngang
    for (let row = 0; row < valueOptionTable; row++) {
        if (board[row].every(cell => cell === player)) {
            return 10;
        }
        if (board[row].every(cell => cell === opponent)) {
            return -10;
        }
    }

    // Kiểm tra hàng dọc
    for (let col = 0; col < valueOptionTable; col++) {
        if (board.every(row => row[col] === player)) {
            return 10;
        }
        if (board.every(row => row[col] === opponent)) {
            return -10;
        }
    }

    // Kiểm tra đường chéo chính
    if (board.every((row, index) => row[index] === player)) {
        return 10;
    }
    if (board.every((row, index) => row[index] === opponent)) {
        return -10;
    }

    // Kiểm tra đường chéo phụ
    if (board.every((row, index) => row[valueOptionTable - 1 - index] === player)) {
        return 10;
    }
    if (board.every((row, index) => row[valueOptionTable - 1 - index] === opponent)) {
        return -10;
    }

    return 0;
}

// Check ô trống
function checkisEmpty(i, j) {
    return array[i][j] === " ";
}
function pauseMusic(){
    musicStart.pause()
};


// Đổi người chơi sau mỗi lần đánh
function swapPlayer() {
    const swapPlayerElement = document.getElementById("swap-Player");
    if (isPlayer) {
        swapPlayerElement.innerHTML = '<span style="color: blue;  font-weight: bold;">X</span>';
    } else {
        swapPlayerElement.innerHTML = '<span style="color: red; font-weight: bold;">O</span>';
    }
}

function timePlayX() {
    const startTimeX = document.getElementById("timeX");
    if (timerX) clearInterval(timerX);  // Xoa thoi gian con lai
    timerX = setInterval(() => {
        totalSecondsX--;
        if (totalSecondsX < 0) {
            alert('X thua vì hết thời gian')
            clearInterval(timerX);  // Dung thoi gian
            totalSecondsX = 0;
        }
        let minutes = Math.floor((totalSecondsX % 3600) / 60);
        let seconds = totalSecondsX % 60;
        startTimeX.textContent =
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }, 1000);
}


function timePlayO() {
    const startTimeO = document.getElementById("timeO");
    if (timerO) clearInterval(timerO);   // Xoa thoi gian con lai
    timerO = setInterval(() => {
        totalSecondsO--;
        if (totalSecondsO < 0) {
            alert('O thua vì hết thời gian')
            clearInterval(timerO);  // Dung thoi gian
            totalSecondsO = 0;
        }
        let minutes = Math.floor((totalSecondsO % 3600) / 60);
        let seconds = totalSecondsO % 60;
        startTimeO.textContent =
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }, 1000);
}

function resetTimer(player) {
    if (player === "X") {
        totalSecondsX = 60;
        clearInterval(timerX);
        timePlayX()
        document.getElementById("timeX").textContent = '01:00';
    } else if (player === "O") {
        totalSecondsO = 60;
        clearInterval(timerO);
        timePlayO()
        document.getElementById("timeO").textContent = '01:00';
    }
}

function stopTimer(player) {
    if (player === "X") {
        clearInterval(timerX);
    } else if (player === "O") {
        clearInterval(timerO);
    }
}

function resetTimers() {
    resetTimer("X");
    resetTimer("O");
}

function checkWinnerPlayer(value) {
        if (valueOptionTable === 5 ) { // Check win 3 ô liên tiếp
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array[i].length; j++) {
                    let checkNB = array[i][j] === value 
                                && array[i + 1][j] === value 
                                && array[i + 2][j] === value;
                    let checkDT = array[i][j] === value 
                                && array[i][j + 1] === value 
                                && array[i][j + 2] === value;
                    let checkBBNN = array[i][j] === value 
                                && array[i + 1][j + 1] === value 
                                && array[i + 2][j + 2] === value;
                    let checkDDTT = array[i][j] === value 
                                && array[i + 1][j - 1] === value 
                                && array[i + 2][j - 2] === value;
                    if (checkNB) {
                        cellsWin.push(`${i}-${j}`);
                        cellsWin.push(`${i + 1}-${j}`);
                        cellsWin.push(`${i + 2}-${j}`);
                    }
                    if (checkDT) {
                        cellsWin.push(`${i}-${j}`);
                        cellsWin.push(`${i}-${j + 1}`);
                        cellsWin.push(`${i}-${j + 2}`);
                    }
                    if (checkBBNN) {
                        cellsWin.push(`${i}-${j}`);
                        cellsWin.push(`${i + 1}-${j + 1}`);
                        cellsWin.push(`${i + 2}-${j + 2}`);
                    }
                    if (checkDDTT) {
                        cellsWin.push(`${i}-${j}`);
                        cellsWin.push(`${i + 1}-${j - 1}`);
                        cellsWin.push(`${i + 2}-${j - 2}`);
                    }
                }
            }
        } else { // Check win 5 ô liên tiếp
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array[i].length; j++) {
                    let checkNB = array[i][j] === value 
                                && array[i + 1][j] === value 
                                && array[i + 2][j] === value 
                                && array[i + 3][j] === value 
                                && array[i + 4][j] === value;
                    let checkDT = array[i][j] === value 
                                && array[i][j + 1] === value 
                                && array[i][j + 2] === value 
                                && array[i][j + 3] === value 
                                && array[i][j + 4] === value;
                    let checkBBNN = array[i][j] === value 
                                && array[i + 1][j + 1] === value 
                                && array[i + 2][j + 2] === value 
                                && array[i + 3][j + 3] === value 
                                && array[i + 4][j + 4] === value;
                    let checkDDTT = array[i][j] === value 
                                && array[i + 1][j - 1] === value 
                                && array[i + 2][j - 2] === value 
                                && array[i + 3][j - 3] === value 
                                && array[i + 4][j - 4] === value;
                     if (checkNB) {
                        cellsWin.push(`${i}-${j}`);
                        cellsWin.push(`${i + 1}-${j}`);
                        cellsWin.push(`${i + 2}-${j}`);
                        cellsWin.push(`${i + 3}-${j}`);
                        cellsWin.push(`${i + 4}-${j}`);
                    }
                    if (checkDT) {
                        cellsWin.push(`${i}-${j}`);
                        cellsWin.push(`${i}-${j + 1}`);
                        cellsWin.push(`${i}-${j + 2}`);
                        cellsWin.push(`${i}-${j + 3}`);
                        cellsWin.push(`${i}-${j + 4}`);
                    }
                    if (checkBBNN) {
                        cellsWin.push(`${i}-${j}`);
                        cellsWin.push(`${i + 1}-${j + 1}`);
                        cellsWin.push(`${i + 2}-${j + 2}`);
                        cellsWin.push(`${i + 3}-${j + 3}`);
                        cellsWin.push(`${i + 4}-${j + 4}`);
                    }
                    if (checkDDTT) {
                        cellsWin.push(`${i}-${j}`);
                        cellsWin.push(`${i + 1}-${j - 1}`);
                        cellsWin.push(`${i + 2}-${j - 2}`);
                        cellsWin.push(`${i + 3}-${j - 3}`);
                        cellsWin.push(`${i + 4}-${j - 4}`);
                    }
                }
            }
        }
}
