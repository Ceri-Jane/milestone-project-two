// Using this custom script in head element so adding this DOM content listener to run once everything in body element has loaded
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const flagsLeft = document.querySelector('#flags-left')
    const width = 10
    //set amount of bombs to be used in the game - use let instead of const as this can then be changed in the future
    let bombAmount = 20

    //Create game board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount

        //get shuffled game array with random 20 bombs and fill with a string named bomb
        const bombArray = Array(bombAmount).fill('bomb')
        //fill all other 80 squares with a string named valid
        const emptyArray = Array(width * width - bombAmount).fill('valid')

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.id = i
            grid.appendChild(square)
        }

    }

    createBoard()

})