const hslDisplay = document.getElementById('hsl-display');
const hexDisplay = document.getElementById('hex-display');
const rgbDisplay = document.getElementById('rgb-display');

const rgbBtn = document.getElementById('rgb-btn');
const hslBtn = document.getElementById('hsl-btn');
const hexBtn = document.getElementById('hex-btn');

const container = document.getElementById('container');
const startContainer = document.getElementById('start-container');
const endContainer = document.getElementById('end-container');

const endScore = document.getElementById('end-score');

const circles = document.querySelectorAll('.circle');
const circleDiv = document.getElementById('circles');

const displayColorGroup = document.getElementById('display-color-group').querySelectorAll('span');
const btnGroup = document.getElementById('button-group').querySelectorAll('.btn');

const displayDifficulty = document.getElementById('display-difficulty');
const displayLifes = document.getElementById('display-lifes');
const displayScore = document.getElementById('display-score');

const successMessage = document.getElementById('success-message');
const popup = document.getElementById('popup-container');

alert("I don't know what's going on, but I'm aware of the styling problems. Gonna fix it soon.");

let colors = [],
    numCircles,
    pickedColor,
    difficulty = 'Medium',
    score = 0,
    lifes = 3,
    oneGuess = true;

// Start app
function init() {
    selectDifficulty();
    reset();
    setupCircles();
    updateLifes();
}

// Create the right amount of circles per difficulty
function selectDifficulty() {
    switch (difficulty) {
        case 'Easy':
            numCircles = 3;
            break;
        case 'Medium':
            numCircles = 6;
            break;
        case 'Hard':
            numCircles = 9;
            break;
        case 'Impossible':
            numCircles = 21;
            break;
        default:
            difficulty = 'Medium';
            numCircles = 6;
            break;
    }
}

// Set up the circles
function setupCircles() {
    circleDiv.style.display = 'block';

    for (let i = 0; i < numCircles; i++) {
        let circle = document.createElement('div');
        circle.setAttribute('class', 'circle');
        circle.style.display = 'block';
        circle.style.backgroundColor = colors[i];
        circleDiv.appendChild(circle);
    }

    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle) => {
        circle.addEventListener('click', function () {
            let clickedColor = this.style.backgroundColor;

            if (clickedColor == pickedColor) {
                increaseScore();

                container.style.backgroundColor = clickedColor;
                popup.style.display = 'flex';

                // Make every circle the right color & give it a white border
                circles.forEach((item) => {
                    item.style.border = '2px solid hsla(210, 36%, 96%, .7)';
                    item.style.backgroundColor = pickedColor;
                });

                // Different message for single guess on impossible level
                difficulty === 'Impossible' && oneGuess == true ? successMessage.innerText = 'Ok.. You\'re a designerd 👨‍🎨' : successMessage.innerText = 'Good job! 😀';
            }
            // If clickedColor !== pickedColor && circle is not already clicked (otherwise: loses points for clicking same circle again)
            else {
                if (!this.classList.contains('clicked')) {
                    lifes--
                    oneGuess = false;
                    this.style.backgroundColor = 'hsl(209, 28%, 39%)';
                    this.classList.add('clicked');
                    updateLifes();
                }
            }
        })
    });
}

// Pick a random color and this will be the correct color during the game
function pickColor() {
    let random = Math.floor(Math.random() * colors.length);

    // Make variable, so it can be used outside the function
    randomValue = colors[random];
    return randomValue;
}

// Push random numbers to array
function generateRandomColors(num) {
    let arr = []
    for (var i = 0; i < num; i++) {
        arr.push(randomColor());
    }

    return arr;
}

// Show switch (color) buttons 
function showButtons(button) {
    // 1) Remove selected class from all classes
    displayColorGroup.forEach((item) => item.classList.remove('selected-display'));
    btnGroup.forEach((item) => item.classList.remove('selected-btn'));

    // 2) Add selected class to correct class
    switch (button) {
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

// Pick new color, reset score & update color display
function reset() {
    clearCircles();

    colors = generateRandomColors(numCircles);
    pickedColor = pickColor();
    oneGuess = true;

    hslDisplay.textContent = RGBtoHSL(pickedColor);
    hexDisplay.textContent = RGBToHex(pickedColor);
    rgbDisplay.textContent = pickedColor;

    startContainer.classList.remove('show');
    popup.style.display = 'none';
    container.style.backgroundColor = 'var(--bg-color)';

    displayScore.textContent = 'Score: ' + score;
    displayDifficulty.innerHTML = `Your difficulty: <strong>${difficulty}</strong>`;
};

// Clear the (old) circles
function clearCircles() {
    circleDiv.innerHTML = '';
}

// Update score
function increaseScore() {
    switch (difficulty) {
        case 'Easy':
            score++;
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

// Update amount of lifes based on current amount of lifes
function updateLifes() {
    lifes >= 1 ? displayLifes.innerHTML = `Lifes: <strong>${lifes}</strong>` : gameOver();
}

// User has 0 lifes --> End screen
function gameOver() {
    endScore.innerHTML = `Your final score is: <strong>${score}</strong`;
    endContainer.style.display = 'flex';
    circleDiv.style.display = 'none';
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
            rgb[R] = Math.round(r.substr(0, r.length - 1) / 100 * 255);
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
        h = ((b - r) / delta) + 2;
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

addEventListeners();

// Event listeners
function addEventListeners() {
    const startBtn = document.getElementById('btn-start-game');
    const newRoundBtn = document.getElementById('new-round-btn');
    const endBtn = document.getElementById('btn-end-game');
    const difficultySelect = document.getElementById('difficulty-select');

    // 'Start game' button on start screen
    startBtn.addEventListener('click', init);

    // Difficulty select on start screen
    difficultySelect.addEventListener('change', e => difficulty = e.target.value);

    // Color shades buttons
    rgbBtn.addEventListener('click', () => showButtons('rgb'));
    hslBtn.addEventListener('click', () => showButtons('hsl'));
    hexBtn.addEventListener('click', () => showButtons('hex'));

    // 'New round' button after giving correct answer
    newRoundBtn.addEventListener('click', init);

    // 'Back to menu' button on end screen
    endBtn.addEventListener('click', () => location.reload());
}


