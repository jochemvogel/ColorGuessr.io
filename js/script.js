let colors = [];
let numSquares = 6;
let pickedColor;
let score = 0;
let guesses = 0;
let oneGuess = true;


let rgbDisplay = document.getElementById("rgb-display");
let h1 = document.querySelector("h1");
let levelButtons = document.querySelectorAll(".level");
let statusDisplay = document.querySelector("#status-message");
let scoreDisplay = document.querySelector("#score");
let squares = document.querySelectorAll(".square");
let squaresDisplay = document.querySelectorAll("#squares");
let resetButton = document.querySelector("#reset");

init();

/*
This function will start the application
*/
function init() {
    setupLevelButtons();
    setupSquares();
    reset();
    updateScore();
}

function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
}

/*
This function will make all the level buttons work
*/
function setupLevelButtons() {
    for(var i = 0; i < levelButtons.length; i++) {
        levelButtons[i].addEventListener("click", function() {
            levelButtons[0].classList.remove("selected");
            levelButtons[1].classList.remove("selected");
            levelButtons[2].classList.remove("selected");
            levelButtons[3].classList.remove("selected");
            this.classList.add("selected");
            if(this.textContent === "Easy") {
                numSquares = 3;
            } else if (this.textContent === "Medium") {
                numSquares = 6;
            } else if (this.textContent === "Hard") {
                numSquares = 9;
            } else {
                numSquares = 30;
            }
            reset();
        });
    }
}

/*
This function need some refactoring
*/

function setupSquares() {
    for(let i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function() {
            let clickedColor = this.style.backgroundColor;
            if(clickedColor === pickedColor) {
                if(levelButtons[3].classList.contains("selected")) {
                    if(guesses === 1) {
                        statusDisplay.textContent = "OK, you're a designerd";
                        resetButton.textContent = "Play Again?";
                        score++;
                        changeColors(clickedColor);
                        h1.style.backgroundColor = clickedColor;
                    } else {
                        statusDisplay.textContent = "Correct!";
                        resetButton.textContent = "Play Again?";
                        score++;
                        changeColors(clickedColor);
                        h1.style.backgroundColor = clickedColor;
                    }
                } else 
                    statusDisplay.textContent = "Correct!";
                    resetButton.textContent = "Play Again?";
                    score++;
                    changeColors(clickedColor);
                    h1.style.backgroundColor = clickedColor;
            } else {
                this.style.backgroundColor = "#232323";
                statusDisplay.textContent = "Try Again";
                score = 0;
                oneGuess = false;
            }
        });
    }
}

/*
This function will pick a new color and will reset the score
*/
function reset() {
    colors = generateRandomColors(numSquares);
    pickedColor = pickColor();
    rgbDisplay.textContent = pickedColor;
    resetButton.textContent = "Reset Colors";
    statusDisplay.textContent = "";
    score = 0;
    oneGuess = true;
    for(var i = 0; i<squares.length; i++) {
        if(colors[i]) {
            squares[i].style.display = "block";
            squares[i].style.backgroundColor = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
    h1.style.background = "#309D00";
}

resetButton.addEventListener("click", function() {
    reset();
});


/*
This function below will change all the squares
to the same background color.
*/
function changeColors(color) {
    for(var i=0; i < squares.length; i++) {
        squares[i].style.backgroundColor = color;
    }
}

/*
This function below will pick a random color.
This random color will be the correct color during the game.
*/
function pickColor() {
    let random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

/*
This function will push random numbers to the array
*/
function generateRandomColors(num) {
    let arr = []
    for(var i = 0; i < num; i++) {
        arr.push(randomColor());
    }
    return arr;
}

/* 
This function will create a random RGB color
*/
function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}


/*
LATER:

---------------------

Scores:
- LEVEL: [numSquares] points (wrong -[numSquares / 3])

- Easy: right +3 points | wrong -1 points
- Medium: right +6 points | wrong -2 points
- Hard: right +9 points | wrong -3 points
- Impossible: right 30 points | wrong -10 points


--------------------

function setUpSquares() {
    for(let i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function() {
            let clickedColor = this.style.backgroundColor;
            if(clickedColor === pickedColor) {
                score = score + numSquares;
            } else {
                score = score - (numSquares / 3);
            }
        }
    }
}
*/
