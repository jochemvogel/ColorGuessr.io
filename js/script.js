const hslDisplay = document.getElementById('hsl-display');
const hexDisplay = document.getElementById('hex-display');
const rgbDisplay = document.getElementById('rgb-display');

const statusDisplay = document.getElementById('status-message');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset');

const h1 = document.querySelector('h1');

const levelButtons = document.querySelectorAll('.level');
const squares = document.querySelectorAll('.square');
const squaresDisplay = document.querySelectorAll('#squares');

let colors = [],
    numSquares = 6,
    pickedColor,
    score = 0,
    guesses = 0,
    oneGuess = true;

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

    hslDisplay.textContent = RGBtoHSL(pickedColor);
    hexDisplay.textContent = RGBToHex(pickedColor);
    rgbDisplay.textContent = pickedColor;  // <-- DISPLAY RGB

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

/*

\o/ Thanks to Jon Kantner (CSS-tricks) for next two functions \o/

*/

// Convert RGB values to HSL
function RGBtoHSL(rgb) {
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    for (let R in rgb) {
      let r = rgb[R];
      if (r.indexOf("%") > -1)
        rgb[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
    }

    // Make r, g and b fractions of 1
    let r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255;

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

function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
}
