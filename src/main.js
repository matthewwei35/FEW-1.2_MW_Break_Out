/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */

// --------------------------------------------------------
// DOM REFERENCES
// --------------------------------------------------------
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// --------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------
const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
const paddleXStart = (canvas.width - paddleWidth) / 2;

const brickRowCount = 5;
const brickColumnCount = 7;

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
// CLASSES
// --------------------------------------------------------
class Ball {
  constructor(x, y, dx = 2, dy = -2, radius = 10, color = '#FFFFFF') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.PI2 = Math.PI * 2;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

const ball = new Ball(canvas.width / 2, canvas.height - 30);

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.status = 1;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Bricks {
  constructor(cols, rows, width = 50, height = 20, padding = 10, offsetTop = 30, offsetLeft = 30, color = '#FCAF3B') {
    this.cols = cols;
    this.rows = rows;
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.offsetTop = offsetTop;
    this.offsetLeft = offsetLeft;
    this.color = color;
    this.bricks = [];
    this.init();
  }

  init() {
    for (let c = 0; c < this.cols; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        const brickX = (c * (this.width + this.padding)) + this.offsetLeft;
        const brickY = (r * (this.height + this.padding)) + this.offsetTop;
        this.bricks[c][r] = new Brick(brickX, brickY, this.width, this.height, this.color);
      }
    }
  }

  render(ctx) {
    for (let c = 0; c < this.cols; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        const brick = this.bricks[c][r];
        if (this.bricks[c][r].status === 1) {
          brick.render(ctx);
        }
      }
    }
  }
}

const bricks = new Bricks(brickColumnCount, brickRowCount);

// --------------------------------------------------------
// FUNCTIONS
// --------------------------------------------------------
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
  for (let c = 0; c < bricks.cols; c += 1) {
    for (let r = 0; r < bricks.rows; r += 1) {
      const b = bricks.bricks[c][r];
      if (b.status === 1) {
        if (ball.x > b.x && ball.x < b.x + bricks.width && ball.y > b.y && ball.y < b.y
            + bricks.height) {
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
  bricks.render(ctx);
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
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

draw();
