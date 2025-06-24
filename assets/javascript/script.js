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

        //get shuffled game array with random bombs
        const bombArray = Array(bombAmount).fill('bomb')

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.id = i
            grid.appendChild(square)
        }

    }

    createBoard()

})