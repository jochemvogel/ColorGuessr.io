const hslDisplay = document.getElementById('hsl-display');
const hexDisplay = document.getElementById('hex-display');
const rgbDisplay = document.getElementById('rgb-display');

const rgbBtn = document.getElementById('rgb-btn');
const hslBtn = document.getElementById('hsl-btn');
const hexBtn = document.getElementById('hex-btn');
const startBtn = document.getElementById('btn-start-game');
const endBtn = document.getElementById('btn-end-game');
const newRoundBtn = document.getElementById('new-round-btn');

const container = document.getElementById('container');
const startContainer = document.getElementById('start-container');
const endContainer = document.getElementById('end-container');

const endScore = document.getElementById('end-score');

const circles = document.querySelectorAll('.circle');
const circleDisplay = document.querySelectorAll('#circles');
const circleDiv = document.getElementById('circles');

const displayColorGroup = document.getElementById('display-color-group');
const displayColorGroupEl = document.querySelectorAll('span');
const btnGroup = document.getElementById('button-group');
const btnGroupEl = btnGroup.querySelectorAll('.btn');

const difficultySelect = document.getElementById('difficulty-select');

const displayDifficulty = document.getElementById('display-difficulty');
const displayLifes = document.getElementById('display-lifes');
const displayScore = document.getElementById('display-score');

let colors = [],
    numCircles,
    difficulty,
    pickedColor,
    score = 0,
    lifes = 3,
    guesses = 0,
    oneGuess = true;

// Set difficulty
const setDifficulty = localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'Easy';
difficulty = setDifficulty;

// Start app
function init() {
    selectDifficulty();
    setupCircles();
    displayLifes.innerHTML = `Lifes: <strong>${lifes}</strong>`; // <-- Replace this with new function
    reset();
    difficultyLS();
}

// Create the right amount of circles per difficulty
function selectDifficulty() {
    switch(difficulty) {
        case 'Easy':
            numCircles = 3;
            break;
        case 'Medium':
            numCircles = 6;
            break;
        case 'Hard':
            numCircles = 9;
            break;
        default:
            numCircles = 30;
    }
}

// Change all circles to same background if answer is correct
function changeColors(color) {
    circles.forEach(item => item.style.backgroundColor = color);
}

// Pick a random color and this will be the correct color during the game
function pickColor() {
    let random = Math.floor(Math.random() * colors.length);

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

// Set up the circles
function setupCircles() {
    circles.forEach((circle) => {
        circle.addEventListener('click', function() {
            let clickedColor = this.style.backgroundColor;

            if(clickedColor == pickedColor) {
                // Make it not possible to click circles twice
                if(newRoundBtn.style.display === 'none') {
                    updateScore();
                    changeColors(clickedColor);
                    container.style.backgroundColor = clickedColor;
                    circles.forEach((circle) => circle.style.border = '2px solid hsla(210, 36%, 96%, .7)');
                    newRoundBtn.style.display = 'block';
                }
            }
            // If clickedColor !== pickedColor
            else {
                updateLifes();

                this.style.backgroundColor = 'hsl(209, 28%, 39%)';
                this.style.border = 'none';

                oneGuess = false;
            } 
        })
    });
}

// Update score
function updateScore() {
    switch (difficulty) {
        case 'Easy':
            score++;
            console.log('this');
            break;
        case 'Medium':
            score += 2;
            break;
        case 'Hard':
            score += 5;
            break;
        case 'Impossible':
            score += 10;
            break;
    }
    displayScore.textContent = 'Score: ' + score;
}

// Decrease amount of lifes after each wrong answer
function updateLifes() {
    if(lifes > 1) {
        lifes--;
        displayLifes.innerHTML = `Lifes: <strong>${lifes}</strong>`;
    } else {
        gameOver();
    }   
}

// Show switch buttons and make them work
function showButtons(button) {
    displayColorGroupEl.forEach((item) => item.classList.remove('selected-display'));
    btnGroupEl.forEach((item) => item.classList.remove('selected-btn'));

    switch(button) {
        case 'rgb':
            rgbDisplay.classList.add('selected-display');
            rgbBtn.classList.add('selected-btn');
            break;
        case 'hsl':
            hslDisplay.classList.add('selected-display');
            hslBtn.classList.add('selected-btn');
            break;
        case 'hex':
            hexDisplay.classList.add('selected-display');
            hexBtn.classList.add('selected-btn');;
            break;
        default:
            alert('Error..');
    }
}

// Create random rgb color
function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

// Pick new color and reset score
function reset() {
    colors = generateRandomColors(numCircles);

    pickedColor = pickColor();

    hslDisplay.textContent = RGBtoHSL(pickedColor);
    hexDisplay.textContent = RGBToHex(pickedColor);
    rgbDisplay.textContent = pickedColor;  // <-- DISPLAY RGB

    container.style.backgroundColor = 'var(--bg-color)';
    circleDiv.style.display = 'block';
    circles.forEach((circle) => circle.style.border = 'none');
    newRoundBtn.style.display = 'none';

    displayScore.textContent = 'Score: ' + score;

    // Refactor this function, so hard codes circles will be replaced by Javascript
    circles.forEach((circle, index) => {
        if(colors[index]) {
            circle.style.display = 'block';
            circle.style.backgroundColor = colors[index];
        } else {
            circle.style.display = 'none';
        }
    })
};

// User has 0 lifes --> End screen
function gameOver() {
    endScore.innerHTML = `Your final score is: <strong>${score}</strong`;
    endContainer.style.display = 'flex';
    circleDiv.style.display = 'none';
}



// Not working yet --> difficulty that's stored in localStorage has to be pre selected
function difficultyLS() {
    // if(difficulty) {
    //     document.getElementById('Medium').selected = 'true';
    //     document.getElementById('Medium').classList.add = 'true';
    //     console.log(typeof difficulty);
    // }
    return true;
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

// Convert RGB values to HEX
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

// EVENT LISTENERS

// Color shades buttons
rgbBtn.addEventListener('click', () => showButtons('rgb'));
hslBtn.addEventListener('click', () => showButtons('hsl'));
hexBtn.addEventListener('click', () => showButtons('hex'));

// 'New round' button after giving correct answer
newRoundBtn.addEventListener('click', reset);

// 'Start game' on start screen
startBtn.addEventListener('click', () => {
    startContainer.classList.remove('show');
    displayDifficulty.innerHTML = `Your difficulty: <strong>${difficulty}</strong>`;
    init();
});

// 'Back to menu' button on end screen
endBtn.addEventListener('click', () => location.reload());

// Difficulty change
difficultySelect.addEventListener('change', e => {
    difficulty = e.target.value;
    localStorage.setItem('difficulty', difficulty);
});