// Using this custom script in head element so adding this DOM content listener to run once everything in body element has loaded
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const width = 10

    //Create game board
    function createBoard() {

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            grid.appendChild(square)
        }

    }

})