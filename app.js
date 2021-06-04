//Variables
const area = document.querySelector(".gameArea");
const highscoreboard = document.querySelector(".hiscoreval");
const volumecontrol = document.querySelector(".volume");
const scoreval = document.querySelector(".scoreval");
const dead = new Audio("audio/audio_dead.mp3");
const eat = new Audio("audio/audio_eat.mp3");
const down = new Audio("audio/audio_down.mp3");
const up = new Audio("audio/audio_up.mp3");
const left = new Audio("audio/audio_left.mp3");
const right = new Audio("audio/audio_right.mp3");
const music = new Audio("audio/bgsong.mp3");
var score = 0;
var hiscore = 0;
var direction = { x: 0, y: 0 };
var food = { x: 10, y: 10 };
var snake = [{ x: 12, y: 12 }];
var speed = 10;
var prevtime = 0;
music.loop = true;
music.volume = 0.1;
//Game Functions
function main(timestamp) {
  window.requestAnimationFrame(main);
  if ((timestamp - prevtime) / 1000 < 1 / speed) return;
  prevtime = timestamp;
  gameengine();
}
//If snake hits
function isCollide(arr) {
  if (arr[0].x > 18 || arr[0].y > 18 || arr[0].x < 1 || arr[0].y < 1)
    return true;
  for (var i = 1; i < arr.length; i++) {
    if (arr[0].x === arr[i].x && arr[0].y === arr[i].y) return true;
  }
  return false;
}
function gameengine() {
  //If snake hits
  if (isCollide(snake)) {
    dead.play();
    window.alert("Game over");
    direction = { x: 0, y: 0 };
    snake = [{ x: 12, y: 12 }];
    score = 0;
    scoreval.innerHTML = score;
  }
  //Updating snake and food after eating
  if (snake[0].x === food.x && snake[0].y === food.y) {
    eat.play();
    score += 1;
    scoreval.innerText = score;
    if (score > hiscore) {
      hiscore = score;
      localStorage.setItem("highscore", JSON.stringify(hiscore));
      highscoreboard.innerHTML = hiscore;
    }
    snake.unshift({ x: snake[0].x + direction.x, y: snake[0].y + direction.y });
    food.x = Math.round(2 + 14 * Math.random());
    food.y = Math.round(2 + 14 * Math.random());
  }
  //movement of snake
  if (direction != { x: 0, y: 0 }) {
    for (var i = snake.length - 1; i >= 1; i--) {
      snake[i] = { ...snake[i - 1] };
    }
    snake[0].x = snake[0].x + direction.x;
    snake[0].y = snake[0].y + direction.y;
  }
  //Rendering food and snake on DOM
  area.innerHTML = "";
  for (var i = 0; i < snake.length; i++) {
    let body = document.createElement("div");
    body.classList.add("snake");
    if (i === 0) {
      body.classList.add("head");
    }
    body.style.gridColumnStart = snake[i].x;
    body.style.gridRowStart = snake[i].y;
    area.appendChild(body);
  }
  let apple = document.createElement("div");
  apple.classList.add("food");
  apple.style.gridColumnStart = food.x;
  apple.style.gridRowStart = food.y;
  area.appendChild(apple);
}
//localstorage
let highscoreval = localStorage.getItem("highscore");
if (highscoreval != null) {
  hiscore = JSON.parse(highscoreval);
  highscoreboard.innerHTML = hiscore;
}
//Animation Frame
window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      up.play();
      direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      down.play();
      direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      left.play();
      direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      right.play();
      direction = { x: 1, y: 0 };
      break;
    default:
      break;
  }
});
volumecontrol.addEventListener("click", (e) => {
  if (e.target.innerHTML == "volume_up") {
    e.target.innerHTML = "volume_off";
    music.pause();
  } else {
    e.target.innerHTML = "volume_up";
    music.play();
  }
});
