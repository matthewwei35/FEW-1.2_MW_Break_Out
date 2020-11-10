/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */

// import Sprite from './Sprite.js';
import Brick from './Brick.js';
import Ball from './Ball.js';

// --------------------------------------------------------
// DOM REFERENCES
// --------------------------------------------------------
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// --------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------
const ball = new Ball(canvas.width / 2, canvas.height - 30);
const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
const paddleXStart = (canvas.width - paddleWidth) / 2;

const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const goldColor = '#FCAF3B';

const customFont = '16px Helvetica';

const ARROW_RIGHT = 'ArrowRight';
const ARROW_LEFT = 'ArrowLeft';
const RIGHT = 'RIGHT';
const LEFT = 'LEFT';

const gameOverMessage = 'GAME OVER';
const winMessage = 'YOU WIN, CONGRATULATIONS!';

// --------------------------------------------------------
// VARIABLES
// --------------------------------------------------------
let dx = 2;
let dy = -2;

let paddleX = paddleXStart;
let rightPressed = false;
let leftPressed = false;

let score = 0;
let lives = 3;

// --------------------------------------------------------
// FUNCTIONS
// --------------------------------------------------------
function initializeBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r += 1) {
      const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
      const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
      bricks[c][r] = new Brick(brickX, brickY, brickWidth, brickHeight, goldColor);
    }
  }
}

function keyDownHandler(e) {
  if (e.key === RIGHT || e.key === ARROW_RIGHT) {
    rightPressed = true;
  } else if (e.key === LEFT || e.key === ARROW_LEFT) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === RIGHT || e.key === ARROW_RIGHT) {
    rightPressed = false;
  } else if (e.key === LEFT || e.key === ARROW_LEFT) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r];
      if (bricks[c][r].status === 1) {
        brick.render(ctx);
      }
    }
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = goldColor;
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = customFont;
  ctx.fillStyle = goldColor;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = customFont;
  ctx.fillStyle = goldColor;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function moveBall() {
  if (ball.x + dx > canvas.width - ballRadius || ball.x + dx < ballRadius) {
    dx = -dx;
  }
}

function collisionPaddle() {
  if (ball.y + dy < ballRadius) {
    dy = -dy;
  } else if (ball.y + dy > canvas.height - ballRadius) {
    if (ball.x + paddleX && ball.x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives -= 1;
      if (!lives) {
        alert(gameOverMessage);
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = paddleXStart;
      }
    }
  }
}

function checkKeys() {
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y
            + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            alert(winMessage);
            document.location.reload();
          }
        }
      }
    }
  }
}

function draw() {
  clearCanvas();
  drawBricks();
  ball.render(ctx);
  drawPaddle();
  drawScore();
  drawLives();
  moveBall();
  collisionPaddle();
  checkKeys();
  collisionDetection();

  ball.x += dx;
  ball.y += dy;
  requestAnimationFrame(draw);
}

// --------------------------------------------------------
// INITIALIZATION
// --------------------------------------------------------
const bricks = [];
initializeBricks();

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

draw();
