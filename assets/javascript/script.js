// Using this custom script in head element so adding this DOM content listener to run once everything in body element has loaded
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const width = 10
    //set amount of bombs to be used in the game - use let instead of const as this can then be changed in the future
    let bombAmount = 20
    let squares = []

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
        console.log(shuffledArray)

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
            square.addEventListener('click', function() {
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
                if (i < 99 && !isRightEdge && [i + 1].classList.contains('bomb')) total++
                //check square directly below and to the left of the one selected
                if (i < 90 && !isLeftEdge && squares[i -1 + width].classList.contains('bomb')) total++
                //check square directly below and to the right of the one selected
                if (i < 88 && !isRightEdge && [i + 1 + width].classList.contains('bomb')) total++
                //check square directly below the one selected
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total)
            }
        }

    }

    createBoard()

    //define function for click
    function click(square) {
        console.log(square)
    }

})