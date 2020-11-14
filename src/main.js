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
const paddleYStart = canvas.height - paddleHeight;

const brickRowCount = 5;
const brickColumnCount = 7;

const ARROW_RIGHT = 'ArrowRight';
const ARROW_LEFT = 'ArrowLeft';
const RIGHT = 'RIGHT';
const LEFT = 'LEFT';

const gameOverMessage = 'GAME OVER';
const winMessage = 'YOU WIN, CONGRATULATIONS!';

// --------------------------------------------------------
// VARIABLES
// --------------------------------------------------------
let rightPressed = false;
let leftPressed = false;

// --------------------------------------------------------
// CLASSES
// --------------------------------------------------------
// Ball
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

  move() {
    if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
      this.dx = -this.dx;
    }
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

// Brick
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

// Bricks
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

// Paddle
class Paddle {
  constructor(x, y, width, height, color = '#FCAF3B') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

const paddle = new Paddle(paddleXStart, paddleYStart, paddleWidth, paddleHeight);

// Score
// Lives
class GameLabel {
  constructor(text, x, y, color = '#FCAF3B', font = '16px Helvetica') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.font = font;
    this.value = 0;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`${this.text} ${this.value}`, this.x, this.y);
  }
}

const scoreLabel = new GameLabel('Score: ', 8, 20);
const livesLabel = new GameLabel('Lives: ', canvas.width - 65, 20);
livesLabel.value = 3;

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
    paddle.moveTo(relativeX - paddleWidth / 2, paddleYStart);
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function collisionPaddle() {
  if (ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    if (ball.x + paddle.x && ball.x < paddle.x + paddleWidth) {
      ball.dy = -ball.dy;
    } else {
      livesLabel.value -= 1;
      if (livesLabel.value < 1) {
        alert(gameOverMessage);
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = 2;
        ball.dy = -2;
        paddle.x = paddleXStart;
      }
    }
  }
}

function checkKeys() {
  if (rightPressed) {
    paddle.x += 7;
    if (paddle.x + paddleWidth > canvas.width) {
      paddle.x = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddle.x -= 7;
    if (paddle.x < 0) {
      paddle.x = 0;
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
          ball.dy = -ball.dy;
          b.status = 0;
          scoreLabel.value += 1;
          if (scoreLabel.value === bricks.cols * bricks.rows) {
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
  paddle.render(ctx);
  scoreLabel.render(ctx);
  livesLabel.render(ctx);
  ball.move();
  collisionPaddle();
  checkKeys();
  collisionDetection();

  ball.x += ball.dx;
  ball.y += ball.dy;
  requestAnimationFrame(draw);
}

// --------------------------------------------------------
// INITIALIZATION
// --------------------------------------------------------
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

draw();
