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
/* iOS Safari ignores contextmenu events */
let longPressTimer = null;

/* Detect if the user is on an iOS device because
iOS Safari ignores contextmenu events */
function isIOS() {
    return /iP(hone|od|ad)/.test(navigator.userAgent);
}

/* Create game board */
function createBoard() {
    flagsLeft.innerHTML = bombAmount;

    /* get shuffled game array with random 20 bombs
    and fill with a string named bomb */
    const bombArray = Array(bombAmount).fill("bomb");
    /* fill all other 80 squares with a string named valid */
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    /* shuffle the 20 bombs strings together with the 80 valid strings */
    const gameArray = emptyArray.concat(bombArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");
        square.id = i;
        square.classList.add(shuffledArray[i]);
        grid.appendChild(square);
        squares.push(square);

        /* Left click */
        square.addEventListener("click", function () {
            click(square);
        });

        /* Right-click (desktop + supported mobile) */
        square.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            addFlag(square);
        });

        /* Long-press (iOS only because iOS
        Safari ignores contextmenu events) */
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

    /* add numbers for the amount of bombs
    around the square thats clicked */
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        /* if clicking on a box on the left edge, do not count bombs
        in boxes to the left as there are no boxes here */
        const isLeftEdge = (i % width === 0);
        /* if clicking on a box on the right edge, do not count bombs
        in boxes to the right as there are no boxes here */
        const isRightEdge = (i % width === width - 1);

        if (squares[i].classList.contains("valid")) {
            if (
                i > 0 &&
                !isLeftEdge &&
                squares[i - 1].classList.contains("bomb")
            ) total++;
            /* check square to the top and right
            of the one selected & makes sure
            not to check any non-existant boxes above the top row */
            if (
                i > 9 &&
                !isRightEdge &&
                squares[i + 1 - width].classList.contains("bomb")
            ) total++;
            /* check square directly above the one selected */
            if (
                i > 10 &&
                squares[i - width].classList.contains("bomb")
            ) total++;
            /* check square to the top and left of the one selected */
            if (
                i > 11 &&
                !isLeftEdge &&
                squares[i - width - 1].classList.contains("bomb")
            ) total++;
            /* check square directly to the right of the one selected */
            if (
                i < 99 &&
                !isRightEdge &&
                squares[i + 1].classList.contains("bomb")
            ) total++;
            /* check square directly below and to
            the left of the one selected */
            if (
                i < 90 &&
                !isLeftEdge &&
                squares[i - 1 + width].classList.contains("bomb")
            ) total++;
            /* check square directly below and to
            the right of the one selected */
            if (
                i < 88 &&
                !isRightEdge &&
                squares[i + 1 + width].classList.contains("bomb")
            ) total++;
            /* check square directly below the one selected */
            if (
                i < 89 &&
                squares[i + width].classList.contains("bomb")
            ) total++;
            squares[i].setAttribute("data", total);
        }
    }
}

/* reset button */
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGame);
resetButton.addEventListener("touchstart", resetGame);

/* add red flag with right click */
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

/* define function for click */
function click(square) {
    /* continue the game if a bomb isn't clicked */
    if (
        isGameOver ||
        square.classList.contains("checked") ||
        square.classList.contains("flag")
    ) return;

    /* end the game if a bomb is clicked */
    if (square.classList.contains("bomb")) {
        gameOver();
    } else {
        /* move .add('checked') here so it's always applied */
        square.classList.add("checked");
        /* show how many bombs are around the square that was
        selected, if any */
        let total = square.getAttribute("data");
        if (total != 0) {
            if (total == 1) square.classList.add("one");
            if (total == 2) square.classList.add("two");
            if (total == 3) square.classList.add("three");
            if (total == 4) square.classList.add("four");
            square.innerHTML = total;
            return;
        }
        /* fans out if there are zero bombs around
        the area of the selected square */
        checkSquare(square);
    }
}

/* add function to fan out if zero bombs are around
the area of selected square */
function checkSquare(square) {
    const id = parseInt(square.id);
    const isLeftEdge = (id % width === 0);
    const isRightEdge = (id % width === width - 1);

setTimeout(function () {
        if (id > 0 && !isLeftEdge)
            click(document.getElementById(id - 1));
        if (id > 9 && !isRightEdge)
            click(document.getElementById(id + 1 - width));
        if (id > 10)
            click(document.getElementById(id - width));
        if (id > 11 && !isLeftEdge)
            click(document.getElementById(id - 1 - width));
        if (id < 98 && !isRightEdge)
            click(document.getElementById(id + 1));
        if (id < 90 && !isLeftEdge)
            click(document.getElementById(id - 1 + width));
        if (id < 88 && !isRightEdge)
            click(document.getElementById(id + 1 + width));
        if (id < 89)
            click(document.getElementById(id + width));
        /* fans out after 10 miliseconds */
    }, 10);
}

function checkForWin() {
    /* Prevent duplicate win messages once game is over and won */
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

function gameOver() {
    result.innerHTML = "BOOOOOM! Game Over!";
    isGameOver = true;

    /* reveal all bombs when the game is over */
    squares.forEach(function (square) {
        if (square.classList.contains("bomb")) {
            square.innerHTML = "💣";
            square.classList.remove("bomb");
            square.classList.add("checked");
        }
    });
}

function resetGame() {
    /* Clear the grid and squares array */
    grid.innerHTML = "";
    squares = [];
    isGameOver = false;
    flags = 0;
    result.innerHTML = "";

    /* reset flagsLeft count on reset */
    flagsLeft.innerHTML = bombAmount;

    /* Recreate the board */
    createBoard();
}

/* ===== Bootstrap mobile navbar collapse on in-page link click ===== */
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