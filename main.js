// --------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;

const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const whiteColor = '#FFFFFF'
const goldColor = '#FCAF3B'

const customFont = '16px Helvetica'

const ARROW_RIGHT = 'ArrowRight'
const ARROW_LEFT = 'ArrowLeft'
const RIGHT = 'RIGHT'
const LEFT = 'LEFT'

// --------------------------------------------------------
// VARIABLES
// --------------------------------------------------------
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let dx = 2;
let dy = -2;

let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

let score = 0;
let lives = 3;

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

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = goldColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = whiteColor;
  ctx.fill();
  ctx.closePath();
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
  if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
    dx = -dx;
  }
}

function collisionPaddle() {
  if (ballY + dy < ballRadius) {
    dy = -dy;
  } else if (ballY + dy > canvas.height - ballRadius) {
    if (ballX + paddleX && ballX < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives -= 1;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
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
        if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  moveBall();
  collisionPaddle();
  checkKeys();
  collisionDetection();

  ballX += dx;
  ballY += dy;
  requestAnimationFrame(draw);
}

// --------------------------------------------------------
// INITIALIZATION
// --------------------------------------------------------
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

draw();
