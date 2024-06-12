let selectOptionsTable = document.getElementById('select-table');
        let valueOptionTable = parseInt(selectOptionsTable.value);
        selectOptionsTable.addEventListener('change', function (event) {
            valueOptionTable = parseInt(event.target.value);
            array = createEmptyBoard(valueOptionTable);
            display();
        });

        let array = createEmptyBoard(valueOptionTable);
        let cellsWin = [];
        let currentPlayer = "X";

        function createEmptyBoard(size) {
            let newArray = new Array(size);
            for (let i = 0; i < size; i++) {
                newArray[i] = new Array(size).fill(' ');
            }
            return newArray;
        }

        function display() {
            let tableString = `<table>`;
            for (let i = 0; i < valueOptionTable; i++) {
                tableString += `<tr>`;
                for (let j = 0; j < valueOptionTable; j++) {
                    tableString += `<td onclick="play(${i},${j})">${array[i][j]}</td>`;
                }
                tableString += `</tr>`;
            }
            tableString += `</table>`;
            document.getElementById("table").innerHTML = tableString;
        }

        function play(i, j) {
            if (array[i][j] === ' ') {
                array[i][j] = currentPlayer;
                if (checkWin(currentPlayer)) {
                    alert(currentPlayer + " wins!");
                    array = createEmptyBoard(valueOptionTable);
                } else if (isBoardFull()) {
                    alert("Draw!");
                    array = createEmptyBoard(valueOptionTable);
                } else {
                    currentPlayer = currentPlayer === "X" ? "O" : "X";
                    if (currentPlayer === "O") {
                        let bestMove = findBestMove(array, "O");
                        array[bestMove.row][bestMove.col] = "O";
                        if (checkWin("O")) {
                            alert("O wins!");
                            array = createEmptyBoard(valueOptionTable);
                        } else if (isBoardFull()) {
                            alert("Draw!");
                            array = createEmptyBoard(valueOptionTable);
                        }
                        currentPlayer = "X";
                    }
                }
                display();
            }
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
            // Kiểm tra hàng ngang
            for (let i = 0; i < valueOptionTable; i++) {
                if (array[i].every(cell => cell === player)) {
                    return true;
                }
            }

            // Kiểm tra hàng dọc
            for (let j = 0; j < valueOptionTable; j++) {
                if (array.every(row => row[j] === player)) {
                    return true;
                }
            }

            // Kiểm tra đường chéo
            if (array.every((row, index) => row[index] === player)) {
                return true;
            }
            if (array.every((row, index) => row[valueOptionTable - 1 - index] === player)) {
                return true;
            }

            return false;
        }

        function findBestMove(board, player) {
            let bestVal = -Infinity;
            let bestMove = { row: -1, col: -1 };

            for (let i = 0; i < valueOptionTable; i++) {
                for (let j = 0; j < valueOptionTable; j++) {
                    if (board[i][j] === ' ') {
                        board[i][j] = player;
                        let moveVal = minimax(board, 0, false, player);
                        board[i][j] = ' ';

                        if (moveVal > bestVal) {
                            bestMove.row = i;
                            bestMove.col = j;
                            bestVal = moveVal;
                        }
                    }
                }
            }

            return bestMove;
        }

        function minimax(board, depth, isMax, player) {
            let score = evaluate(board, player);

            if (score === 10) {
                return score - depth;
            }
            if (score === -10) {
                return score + depth;
            }
            if (isBoardFull()) {
                return 0;
            }

            if (isMax) {
                let best = -Infinity;
                for (let i = 0; i < valueOptionTable; i++) {
                    for (let j = 0; j < valueOptionTable; j++) {
                        if (board[i][j] === ' ') {
                            board[i][j] = player;
                            best = Math.max(best, minimax(board, depth + 1, !isMax, player));
                            board[i][j] = ' ';
                        }
                    }
                }
                return best;
            } else {
                let best = Infinity;
                for (let i = 0; i < valueOptionTable; i++) {
                    for (let j = 0; j < valueOptionTable; j++) {
                        if (board[i][j] === ' ') {
                            board[i][j] = player === "O" ? "X" : "O";
                            best = Math.min(best, minimax(board, depth + 1, !isMax, player));
                            board[i][j] = ' ';
                        }
                    }
                }
                return best;
            }
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

            // Kiểm tra đường chéo
            if (board.every((row, index) => row[index] === player)) {
                return 10;
            }
            if (board.every((row, index) => row[valueOptionTable - 1 - index] === player)) {
                return 10;
            }
            if (board.every((row, index) => row[index] === opponent)) {
                return -10;
            }
            if (board.every((row, index) => row[valueOptionTable - 1 - index] === opponent)) {
                return -10;
            }

            return 0;
        }

        display();

