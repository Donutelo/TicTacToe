const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Linhas
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Colunas
  [0, 4, 8],
  [2, 4, 6], // Diagonais
];

let board = (function () {
  gameboard = Array(9).fill("");
  return gameboard;
})();

function createPlayer(name, symbol) {
  let win,
    lost,
    tie = 0;

  const wonOne = () => win++;
  const loseOne = () => lost++;
  const tieOne = () => tie++;

  return { name, symbol, wonOne, loseOne, tieOne };
}

const players = [];

const playerOneBtn = document.querySelector("button[name='player-one-button']");
const playerTwoBtn = document.querySelector("button[name='player-two-button']");

[playerOneBtn, playerTwoBtn].forEach((playerBtn) =>
  playerBtn.addEventListener("click", (e) => {
    const playerName = e.target.parentElement.querySelector(
      "input[name^='player-']"
    ).value;

    const playerSymbol = e.target.parentElement.querySelector(
      "input[name^='player-'][name*='-symbol']"
    ).value;

    players.push(createPlayer(playerName, playerSymbol));

    if (players.length === 2) {
      TicTacToe.init();
    } else if (players.length >= 3) {
      players.splice(0, 2);
    }
  })
);

const TicTacToe = {
  currentPlayer: 0,
  winner: "",
  displayBoard: document.getElementById("board"),

  init() {
    if (board.every((item) => item === "")) {
      this.createBoard();
    } else {
      this.resetGame();
    }

    // Comentei porque esse botão ainda não existe
    /*
    document.getElementById("reset")
            .addEventListener("click", () => this.resetGame());
    */
  },

  // Cria o tabuleiro dinamicamente
  createBoard() {
    this.resetScore();
    this.displayBoard.innerHTML = "";
    board.forEach((_, i) => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.dataset.index = i;
      square.addEventListener("click", () =>
        this.updateBoard(i, players[this.currentPlayer].symbol)
      );
      this.displayBoard.appendChild(square);
    });
  },

  resetGame() {
    this.resetScore();
    board = board.map((item) => (item = ""));
    document.querySelectorAll(".square").forEach((square) => {
      square.classList.remove("disable-click");
      square.textContent = "";
    });
  },

  // checkWinner muda as variáveis dentro dos objetos dos jogadores
  // devo me lembrar disso
  checkWinner() {
    let currentScore;
    let newScore;
    let winScore;
    let loseScore;
    let tieScore;

    for (const [a, b, c] of winCombinations) {
      if (board[a] === board[b] && board[b] === board[c] && board[a] !== "") {
        for (let player of players) {
          if (player.symbol === board[a]) {
            player.wonOne();

            this.winner = player.name;

            // Podeira fazer um método para isso, sem dúvida, mas não estou afim
            if (player === players[0]) {
              winScore = document.querySelector(".player-one-score .win");
            } else {
              winScore = document.querySelector(".player-two-score .win");
            }
            
            this.updateScore(currentScore, newScore, winScore);

          } else {
            player.loseOne();

            if (player === players[0]) {
              loseScore = document.querySelector(".player-one-score .lose");
            } else {
              loseScore = document.querySelector(".player-two-score .lose");
            }
            
            this.updateScore(currentScore, newScore, loseScore);
          }
        }
        return this.winner;
      }
    }

    if (board.every((item) => item !== "")) {
      for (let player of players) {
        player.tieOne();

        if (player === players[0]) {
          tieScore = document.querySelector(".player-one-score .tie");
        } else {
          tieScore = document.querySelector(".player-two-score .tie");
        }

        this.updateScore(currentScore, newScore, tieScore);
      }
    }
  },

  updateScore(currentScore, newScore, stateScore) {
    if (Number(stateScore.textContent.slice(-1))) {
      currentScore = Number(stateScore.textContent.slice(-1));
      newScore = currentScore + 1;
      stateScore.textContent = stateScore.textContent.replace(currentScore, newScore.toString());
      // stateScore.textContent += ` ${newScore}`;
    } else {
      stateScore.textContent += " 1";
    }
  },

  resetScore() {
    document.querySelectorAll(".win").forEach(score => {
      score.textContent = "Win: ";
    });

    document.querySelectorAll(".lose").forEach(score => {
      score.textContent = "Lost: ";
    });

    document.querySelectorAll(".tie").forEach(score => {
      score.textContent = "Tie: ";
    });
  },

  updateBoard(index, symbol) {
    if (board[index] !== "") {
      return;
    }

    board[index] = symbol;
    document.querySelector(`[data-index='${index}']`).textContent = symbol;
    this.winner = this.checkWinner();

    if (this.winner) {
      // Depois vou mudar para o DOM e etc
      console.log(`O jogador ${this.winner} venceu`);
      this.makeUnclickable();
    } else if (this.isFull()) {
      this.makeUnclickable();
    } else {
      this.currentPlayer = (this.currentPlayer + 1) % players.length;
    }
  },

  isFull() {
    return Array.from(this.displayBoard.children).every(
      (item) => item.textContent !== ""
    );
  },

  makeUnclickable() {
    Array.from(this.displayBoard.children).forEach((item) => {
      item.classList.add("disable-click");
    });
  },
};

const resetBtn = document.querySelector("div[class='reset'] button");

resetBtn.addEventListener("click", () => TicTacToe.resetGame());
