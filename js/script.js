let hslDisplay = document.getElementById('hsl-display');
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

    // Take all individual rgb values from rgb array
    rgbArray = randomWord.replace(/[^\d,]/g, '').split(',');

    hslDisplay.textContent = RGBtoHSL(rgbArray[0], rgbArray[1], rgbArray[2]); // <-- DISPLAY HSL 
    rgbDisplay.textContent = pickedColor; // <-- DISPLAY RGB

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
    console.log(`Random rgb color picked: ${colors[random]}`);

    // Make variable, so it can be used outside the function
    randomWord = colors[random];
    return randomWord;
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

// Convert RGB values to HSL
// Thanks to Jon Kantner (CSS-tricks)
function RGBtoHSL(r, g, b) {
    // Make r, g and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // 1) Calculate HUE

    // No difference
    if (delta == 0) {
        h = 0;
    // Red is max
    } else if (cmax == r) {
        h = ((g - b) / delta) % 6;
    // Green is max
    } else if (cmax == g) {
        h = ((b - r) / delta)  + 2;
    // Blue is max
    } else {
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);

    if (h < 0) {
        h += 360;
    }

    // 2) Calculate LIGHTNESS
    l = (cmax + cmin) / 2;

    // 3) Calculate SATURATION
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(0);
    l = +(l * 100).toFixed(0);

    return "hsl(" + h + ", " + s + "%, " + l + "%)";
}
