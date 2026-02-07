// Game Constants and Variables

let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("/Music/food.mp3");
const gameOverSound = new Audio("/Music/gameover.mp3");
const moveSound = new Audio("/Music/move.mp3");
const musicSound = new Audio("/Music/music.mp3");

let score = 0;
let speed = 4;
let lastPaintTime = 0;

let snakeArr = [{ x: 13, y: 15 }];

let food = { x: 6, y: 7 };
// Game Functions

const main = (currentTime) => {
  window.requestAnimationFrame(main);
  //   console.log(currentTime);
  if ((currentTime - lastPaintTime) / 1000 < 1 / speed) {
    //To Drop FPS Of the Game so it run smoother
    return;
  }
  lastPaintTime = currentTime;
  gameEngine();
};

const isCollide = (snake) => {
  // if you bump yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // if u hit the wall
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
};

const gameEngine = () => {
  //Part 1: Updating the snake array & food
  if (isCollide(snakeArr)) {
    musicSound.pause();
    gameOverSound.play();
    inputDir = { x: 0, y: 0 };
    alert("Game Over. Press Any key to play again!");
    snakeArr = [{ x: 13, y: 15 }];
    //musicSound.play();
    score = 0;
  }

  // if u have eaten the food , increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score++;
    if (score > highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("highScore", JSON.stringify(highScoreVal));
      highScoreBox.innerHTML = "HighScore: " + highScoreVal;
    }
    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  // Moving the snake(the last segment will go to the position of its precious segment )
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] }; // a new separate obj which has only snakeArr[i]
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;
  //Part 2: Display the snake and food
  board.innerHTML = "";

  //Display the Snake
  snakeArr.forEach((e, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      // for the head to be shown
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  //Display the Food
  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
};

// Main Logic Starts here
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
  highScoreVal = 0;
  localStorage.setItem("highScore", JSON.stringify(highScoreVal));
} else {
  highScoreVal = JSON.parse(highScore);
  highScoreBox.innerHTML = "HighScore: " + highScore;
}
window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  inputDir = { x: 0, y: 1 }; // start the game
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      console.log("ArrowUp");
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowDown":
      console.log("ArrowDown");
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowLeft":
      console.log("ArrowLeft");
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    case "ArrowRight":
      console.log("ArrowRight");
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    default:
      break;
  }
});
