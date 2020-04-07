const hslDisplay = document.getElementById('hsl-display');
const hexDisplay = document.getElementById('hex-display');
const rgbDisplay = document.getElementById('rgb-display');

const rgbBtn = document.getElementById('rgb-btn');
const hslBtn = document.getElementById('hsl-btn');
const hexBtn = document.getElementById('hex-btn');

const newRoundBtn = document.getElementById('new-round-btn');

const statusDisplay = document.getElementById('status-message');
const scoreDisplay = document.getElementById('score');
const container = document.getElementById('container');

const h1 = document.querySelector('h1');

const circles = document.querySelectorAll('.circle');
const circleDisplay = document.querySelectorAll('#circles');

const displayGroup = document.getElementById('display-group');
const displayGroupEl = document.querySelectorAll('span');
const btnGroup = document.getElementById('btn-group');
const btnGroupEl = btnGroup.querySelectorAll('.btn');

let colors = [],
    numCircles = 6,
    pickedColor,
    score = 0,
    guesses = 0,
    oneGuess = true;

init();

// Start app
function init() {
    setupCircles();
    reset();
    updateScore();
}

// Update score
function updateScore() {
    scoreDisplay.textContent = 'Score: ' + score;
}

// Set up the circles
function setupCircles() {
    circles.forEach((circle) => {
        circle.addEventListener('click', function() {
            let clickedColor = this.style.backgroundColor;

            if(clickedColor == pickedColor) {
                // Make it not possible to click circles twice
                if(newRoundBtn.style.display === 'none') {
                    score++;
                    updateScore();
                    changeColors(clickedColor);
                    container.style.backgroundColor = clickedColor;
                    circles.forEach((circle) => circle.style.border = '2px solid hsla(210, 36%, 96%, .7)');
                    newRoundBtn.style.display = 'block';
                }
            }
            // If clickedColor !== pickedColor
            else {
                this.style.backgroundColor = 'hsl(209, 28%, 39%)';
                this.style.border = 'none';
                score = 0;
                updateScore();
                oneGuess = false;
            } 
        })
    });
}

// Show switch buttons and make them work
function showButtons(button) {
    displayGroupEl.forEach((item) => item.classList.remove('selected-display'));
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

// Pick new color and reset score
function reset() {
    colors = generateRandomColors(numCircles);

    pickedColor = pickColor();

    hslDisplay.textContent = RGBtoHSL(pickedColor);
    hexDisplay.textContent = RGBToHex(pickedColor);
    rgbDisplay.textContent = pickedColor;  // <-- DISPLAY RGB

    container.style.backgroundColor = 'var(--bg-color)';
    circles.forEach((circle) => circle.style.border = 'none');
    newRoundBtn.style.display = 'none';

    // Refactor this function, so hard codes circles will be replaced by Javascript
    circles.forEach((circle, index) => {
        if(colors[index]) {
            circle.style.display = 'block';
            circle.style.backgroundColor = colors[index];
        } else {
            circle.style.display = 'none';
        }
    });
};

// Change all circles to same background if answer is correct
function changeColors(color) {
    circles.forEach(item => item.style.backgroundColor = color);
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

// EVENT LISTENERS

rgbBtn.addEventListener('click', () => showButtons('rgb'));
hslBtn.addEventListener('click', () => showButtons('hsl'));
hexBtn.addEventListener('click', () => showButtons('hex'));

newRoundBtn.addEventListener('click', reset);

