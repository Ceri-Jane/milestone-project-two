// Using this custom script in head element so adding this DOM content listener to run once everything in body element has loaded
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const width = 10
    //set amount of bombs to be used in the game - use let instead of const as this can then be changed in the future
    let bombAmount = 20
    let squares = []
    let isGameOver = false
    let flags = 0

    //Create game board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount

        //get shuffled game array with random 20 bombs and fill with a string named bomb
        const bombArray = Array(bombAmount).fill('bomb')
        //fill all other 80 squares with a string named valid
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        //shuffle the 20 bombs strings together with the 80 valid strings
        const gameArray = emptyArray.concat(bombArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.id = i
            //add class name to each square to match what string is in it at the time
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //normal left click
            square.addEventListener('click', function() {
                click(square)

            })

            //ctrl & left click for adding flags
            square.addEventListener('contextmenu', function() {
                addFlag(square)
            })
        }

        //add numbers for the amount of bombs around the square thats clicked
        for ( let i = 0; i < squares.length; i++) {
            let total = 0
            //if clicking on a box on the left edge, do not count bombs in boxes to the left as there are no boxes here
            const isLeftEdge = (i % width === 0)
            //if clicking on a box on the right edge, do not count bombs in boxes to the right as there are no boxes here
            const isRightEdge = (i % width === width - 1)

            if ( squares[i].classList.contains('valid') ) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                //check square to the top and right of the one selected & makes sure not to check any non-existant boxes above the top row
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total ++
                //check square directly above the one selected
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++
                //check square to the top and left of the one selected
                if (i > 11 && !isLeftEdge && squares[i - width - 1].classList.contains('bomb')) total++
                //check square directly to the right of the one selected
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                //check square directly below and to the left of the one selected
                if (i < 90 && !isLeftEdge && squares[i -1 + width].classList.contains('bomb')) total++
                //check square directly below and to the right of the one selected
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                //check square directly below the one selected
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total)
            }
        }

    }

    createBoard()

    //add red flag with right click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                flags++
                square.innerHTML = '🚩'
                flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove('flag')
                flags--
                square.innerHTML = ''
                flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    //define function for click
    function click(square) {
        console.log(square)
        //continue the game if a bomb isn't clicked
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag') ) return

        //end the game if a bomb is clicked
        if (square.classList.contains('bomb')) {
            gameOver()
        } else {
            //show how many bombs are around the square that was selected, if any
            let total = square.getAttribute('data')
            if (total != 0) {
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
            return
            } 
            //fans out if there are zero bombs around the area of the selected square
            checkSquare(square)
        }
        square.classList.add('checked')
    }

    //add function to fan out if zero bombs are around the area of selected square
    function checkSquare(square) {
        const currentId = square.id
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)
        
        setTimeout(function() {
            if (currentId > 0 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = parseInt(currentId) +1 -width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 10) {
                const newId = parseInt(currentId) - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = parseInt(currentId) + 1
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 +width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = parseInt(currentId) + 1 +width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 89) {
                const newId = parseInt(currentId) + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
       
            //fans out after 10 miliseconds    
        }, 10)
    }

    function checkForWin() {
        let matches = 0

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
            if (matches === bombAmount) {
                result.innerHTML = 'YAY! YOU WIN!'
                isGameOver = true
            }
        }
    }

    function gameOver() {
        result.innerHTML = 'BOOOOOM! Game Over!'
        isGameOver = true

        //reveal all bombs when the game is over
        squares.forEach(function(square) {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }

})