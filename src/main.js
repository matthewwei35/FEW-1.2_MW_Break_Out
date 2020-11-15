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

// Score and Lives
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

// Game
class Game {
  constructor() {
    this.ball = new Ball(canvas.width / 2, canvas.height - 30);
    this.bricks = new Bricks(brickColumnCount, brickRowCount);
    this.paddle = new Paddle(paddleXStart, paddleYStart, paddleWidth, paddleHeight);
    this.scoreLabel = new GameLabel('Score: ', 8, 20);
    this.livesLabel = new GameLabel('Lives: ', canvas.width - 65, 20);

    this.rightPressed = false;
    this.leftPressed = false;

    this.setup();

    this.draw();
  }

  setup() {
    this.livesLabel.value = 3;
    document.addEventListener('keydown', (e) => {
      this.keyDownHandler(e);
    });
    document.addEventListener('keyup', (e) => {
      this.keyUpHandler(e);
    });
    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
  } // End Setup

  collisionDetection() {
    for (let c = 0; c < this.bricks.cols; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const b = this.bricks.bricks[c][r];
        if (b.status === 1) {
          if (this.ball.x > b.x && this.ball.x < b.x + this.bricks.width && this.ball.y > b.y
            && this.ball.y < b.y + this.bricks.height) {
            this.ball.dy = -this.ball.dy;
            b.status = 0;
            this.scoreLabel.value += 1;
            if (this.scoreLabel.value === this.bricks.cols * this.bricks.rows) {
              alert(winMessage);
              document.location.reload();
            }
          }
        }
      }
    }
  } // End Collision Detection

  collisionPaddle() {
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > canvas.height - this.ball.radius) {
      if (this.ball.x + this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        this.ball.dy = -this.ball.dy;
      } else {
        this.livesLabel.value -= 1;
        if (this.livesLabel.value === 0) {
          alert(gameOverMessage);
          document.location.reload();
        } else {
          this.ball.x = canvas.width / 2;
          this.ball.y = canvas.height - 30;
          this.ball.dx = 2;
          this.ball.dy = -2;
          this.paddle.x = paddleXStart;
        }
      }
    }
  }

  keyDownHandler(e) {
    if (e.key === RIGHT || e.key === ARROW_RIGHT) {
      this.rightPressed = true;
    } else if (e.key === LEFT || e.key === ARROW_LEFT) {
      this.leftPressed = true;
    }
  } // End Key Down Handler

  keyUpHandler(e) {
    if (e.key === RIGHT || e.key === ARROW_RIGHT) {
      this.rightPressed = false;
    } else if (e.key === LEFT || e.key === ARROW_LEFT) {
      this.leftPressed = false;
    }
  } // End Key Up Handler

  mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      this.paddle.moveTo(relativeX - this.paddle.width / 2, this.paddle.y);
    }
  } // End Mouse Move Handler

  checkKeys() {
    if (this.rightPressed) {
      this.paddle.x += 7;
      if (this.paddle.x + this.paddle.width > canvas.width) {
        this.paddle.x = canvas.width - this.paddle.width;
      }
    } else if (this.leftPressed) {
      this.paddle.x -= 7;
      if (this.paddle.x < 0) {
        this.paddle.x = 0;
      }
    }
  } // End Check Keys

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.bricks.render(ctx);
    this.ball.render(ctx);
    this.paddle.render(ctx);
    this.scoreLabel.render(ctx);
    this.livesLabel.render(ctx);
    this.ball.move();
    this.collisionPaddle();
    this.checkKeys();
    this.collisionDetection();
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    requestAnimationFrame(() => {
      this.draw();
    });
  }
} // End Game Class

const game = new Game();
