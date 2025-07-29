
const grid = document.querySelector(".game-grid");
const flagsLeft = document.querySelector("#flags-left");
const result = document.querySelector("#result");
const width = 10;
/* set amount of bombs to be used in the game -
use let instead of const as this can then be
changed in the future */
let bombAmount = 20;
let squares = [];
let isGameOver = false;
let flags = 0;
// iOS Safari ignores contextmenu events
let longPressTimer = null;

/**
 * Reset button event listener setup.
 * Wrapped in DOMContentLoaded to ensure the element and resetGame() exist.
 */
document.addEventListener("DOMContentLoaded", function () {
  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", resetGame);
  resetButton.addEventListener("touchstart", resetGame);
});

/**
 * Detect if the user is on an iOS device.
 * iOS Safari ignores contextmenu events.
 * @returns {boolean}
 */
function isIOS() {
    return /iP(hone|od|ad)/.test(navigator.userAgent);
}

/**
 * Initializes and renders the Minesweeper game board.
 * 
 * - Randomly distributes bombs and valid tiles across the grid.
 * - Creates individual square elements and appends them to the game grid container.
 * - Adds event listeners for user interactions:
 *    - Left-click for revealing squares.
 *    - Right-click (or two-finger tap) for placing/removing flags.
 *    - Long-press support for iOS devices to mimic right-click functionality, 
 *      due to Safari's lack of support for 'contextmenu' events.
 * - After placing all squares, calculates and assigns the number of adjacent bombs 
 *   to each non-bomb square via a 'data' attribute.
 *
 * Modifies:
 * - `squares` array with DOM elements.
 * - Updates the DOM with flag and bomb counts.
 */
function createBoard() {
    flagsLeft.innerHTML = bombAmount;

    const bombArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");
        square.id = i;
        square.classList.add(shuffledArray[i]);
        grid.appendChild(square);
        squares.push(square);

        square.addEventListener("click", function () {
            click(square);
        });

        square.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            addFlag(square);
        });

        if (isIOS()) {
            square.addEventListener("touchstart", function () {
                longPressTimer = setTimeout(() => {
                    addFlag(square);
                }, 500);
            });

            square.addEventListener("touchend", function () {
                clearTimeout(longPressTimer);
            });

            square.addEventListener("touchmove", function () {
                clearTimeout(longPressTimer);
            });
        }
    }

    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if (squares[i].classList.contains("valid")) {
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++;
            if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
            if (i > 11 && !isLeftEdge && squares[i - width - 1].classList.contains("bomb")) total++;
            if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++;
            if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++;
            if (i < 89 && squares[i + width].classList.contains("bomb")) total++;
            squares[i].setAttribute("data", total);
        }
    }
}

/**
 * Toggle a flag on a square to mark it as suspected to contain a bomb.
 * @param {HTMLElement} square
 */
function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && (flags < bombAmount)) {
        if (!square.classList.contains("flag")) {
            square.classList.add("flag");
            flags++;
            square.innerHTML = "🚩";
            flagsLeft.innerHTML = bombAmount - flags;
            checkForWin();
        } else {
            square.classList.remove("flag");
            flags--;
            square.innerHTML = "";
            flagsLeft.innerHTML = bombAmount - flags;
        }
    }
}

/**
 * Handle left-click on a square. If it's a bomb, trigger game over.
 * Otherwise, show number or fan out if zero.
 * @param {HTMLElement} square
 */
function click(square) {
    if (
        isGameOver ||
        square.classList.contains("checked") ||
        square.classList.contains("flag")
    ) return;

    if (square.classList.contains("bomb")) {
        gameOver();
    } else {
        square.classList.add("checked");
        let total = square.getAttribute("data");
        if (total != 0) {
            if (total == 1) square.classList.add("one");
            if (total == 2) square.classList.add("two");
            if (total == 3) square.classList.add("three");
            if (total == 4) square.classList.add("four");
            square.innerHTML = total;
            return;
        }
        checkSquare(square);
    }
}

/**
 * Fan out and reveal adjacent squares if no bombs are nearby.
 * @param {HTMLElement} square
 */
function checkSquare(square) {
    const id = parseInt(square.id);
    const isLeftEdge = (id % width === 0);
    const isRightEdge = (id % width === width - 1);

    setTimeout(function () {
        if (id > 0 && !isLeftEdge) click(document.getElementById(id - 1));
        if (id > 9 && !isRightEdge) click(document.getElementById(id + 1 - width));
        if (id > 10) click(document.getElementById(id - width));
        if (id > 11 && !isLeftEdge) click(document.getElementById(id - 1 - width));
        if (id < 98 && !isRightEdge) click(document.getElementById(id + 1));
        if (id < 90 && !isLeftEdge) click(document.getElementById(id - 1 + width));
        if (id < 88 && !isRightEdge) click(document.getElementById(id + 1 + width));
        if (id < 89) click(document.getElementById(id + width));
    }, 10);
}

/**
 * Check if all bombs have been correctly flagged.
 * If so, declare win and end game.
 */
function checkForWin() {
    if (isGameOver) return;

    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
        if (
            squares[i].classList.contains("flag") &&
            squares[i].classList.contains("bomb")) {
            matches++;
        }
        if (matches === bombAmount) {
            result.innerHTML = "YAY! YOU WIN!";
            isGameOver = true;
        }
    }
}

/**
 * End the game and reveal all bombs.
 */
function gameOver() {
    result.innerHTML = "BOOOOOM! Game Over!";
    isGameOver = true;

    squares.forEach(function (square) {
        if (square.classList.contains("bomb")) {
            square.innerHTML = "💣";
            square.classList.remove("bomb");
            square.classList.add("checked");
        }
    });
}

/**
 * Reset the game to its initial state.
 */
function resetGame() {
    grid.innerHTML = "";
    squares = [];
    isGameOver = false;
    flags = 0;
    result.innerHTML = "";
    flagsLeft.innerHTML = bombAmount;
    createBoard();
}

// Bootstrap mobile navbar collapse on in-page link click
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
        bsCollapse.hide();
      }
    });
  });
});

createBoard();
