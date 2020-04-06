
let rgbDisplay = document.getElementById('rgb-display');
let statusDisplay = document.getElementById('status-message');
let scoreDisplay = document.getElementById('score');
let resetButton = document.getElementById('reset');

let h1 = document.querySelector('h1');

let levelButtons = document.querySelectorAll('.level');
let squares = document.querySelectorAll('.square');
let squaresDisplay = document.querySelectorAll('#squares');


let colors = [];
let numSquares = 6;
let pickedColor;
let score = 0;
let guesses = 0;
let oneGuess = true;

init();

// Start app
function init() {
    setupLevelButtons();
    setupSquares();
    reset();
    updateScore();
}

// Update score
function updateScore() {
    scoreDisplay.textContent = 'Score: ' + score;
}

// Make level buttons work
function setupLevelButtons() {
    levelButtons.forEach((item) => {
        item.addEventListener('click', function() {
            levelButtons[0].classList.remove('selected');
            levelButtons[1].classList.remove('selected');
            levelButtons[2].classList.remove('selected');
            levelButtons[3].classList.remove('selected');
            this.classList.add('selected');
            if(this.textContent === 'Easy') {
                numSquares = 3;
            } else if (this.textContent === 'Medium') {
                numSquares = 6;
            } else if (this.textContent === 'Hard') {
                numSquares = 9;
            } else {
                numSquares = 30;
            }
            reset();
        });
    });
}

// Set up the squares
function setupSquares() {
    squares.forEach((square, index) => {
        square.addEventListener('click', function() {
            let clickedColor = this.style.backgroundColor;

            if(clickedColor == pickedColor) {

                // Impossible level
                if(levelButtons[3].classList.contains('selected')) {

                    // In one guess (not working yet)
                    if(guesses === 0) {
                        statusDisplay.textContent = 'OK, you\'re a designerd';
                        resetButton.textContent = 'Play Again?';
                        score++;
                        changeColors(clickedColor);
                        h1.style.backgroundColor = clickedColor;
                    // In more than one guess
                    } else {
                        statusDisplay.textContent = 'Correct!';
                        resetButton.textContent = 'Play Again?';
                        score++;
                        changeColors(clickedColor);
                        h1.style.backgroundColor = clickedColor;
                    }

                // Easy, medium and hard level
                } else 
                    statusDisplay.textContent = 'Correct!';
                    resetButton.textContent = 'Play Again?';
                    score++;
                    changeColors(clickedColor);
                    h1.style.backgroundColor = clickedColor;

            // If clickedColor !== pickedColor
            } else {
                this.style.backgroundColor = '#232323';
                statusDisplay.textContent = 'Try Again';
                score = 0;
                oneGuess = false;
            } 
        })
    });
}

// Pick new color and reset score
function reset() {
    colors = generateRandomColors(numSquares);
    pickedColor = pickColor();
    rgbDisplay.textContent = pickedColor;
    resetButton.textContent = 'Reset Colors';
    statusDisplay.textContent = '';
    score = 0;
    oneGuess = true;

    squares.forEach((square, index) => {
        if(colors[index]) {
            square.style.display = 'block';
            square.style.backgroundColor = colors[index];
        } else {
            square.style.display = 'none';
        }
    });

    h1.style.background = '#309D00';
    }
    
    resetButton.addEventListener('click', function() {
        reset();
});

// Change all squares to same background if answer is correct
function changeColors(color) {
    squares.forEach(item => item.style.backgroundColor = color);
}

// Pick a random color and this will be the correct color during the game
function pickColor() {
    let random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

// Push random numbers to array
function generateRandomColors(num) {
    let arr = []
    for(var i = 0; i < num; i++) {
        arr.push(randomColor());
    }
    
    return arr;

}

// Create random rgb color
function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}
