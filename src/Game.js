/* eslint-disable no-alert */
// --------------------------------------------------------
// GAME
// --------------------------------------------------------

import Sprite from './Sprite';
import Ball from './Ball';
import Bricks from './Bricks';
import GameLabel from './GameLabel';

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.paddleXStart = (this.canvas.width - this.paddleWidth) / 2;
    this.paddleYStart = this.canvas.height - this.paddleHeight;
    this.brickRowCount = 5;
    this.brickColumnCount = 7;
    this.ARROW_RIGHT = 'ArrowRight';
    this.ARROW_LEFT = 'ArrowLeft';
    this.RIGHT = 'RIGHT';
    this.LEFT = 'LEFT';
    this.gameOverMessage = 'GAME OVER';
    this.winMessage = 'YOU WIN, CONGRATULATIONS!';

    this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 30);
    this.bricks = new Bricks(this.brickColumnCount, this.brickRowCount);
    this.paddle = new Sprite(this.paddleXStart, this.paddleYStart, this.paddleWidth,
      this.paddleHeight, '#FCAF3B');
    this.scoreLabel = new GameLabel('Score: ', 8, 20);
    this.livesLabel = new GameLabel('Lives: ', this.canvas.width - 65, 20);

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
              alert(this.winMessage);
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
    } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
      if (this.ball.x + this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width) {
        this.ball.dy = -this.ball.dy;
      } else {
        this.livesLabel.value -= 1;
        if (this.livesLabel.value === 0) {
          alert(this.gameOverMessage);
          document.location.reload();
        } else {
          this.ball.x = this.canvas.width / 2;
          this.ball.y = this.canvas.height - 30;
          this.ball.dx = 2;
          this.ball.dy = -2;
          this.paddle.x = this.paddleXStart;
        }
      }
    }
  }

  keyDownHandler(e) {
    if (e.key === this.RIGHT || e.key === this.ARROW_RIGHT) {
      this.rightPressed = true;
    } else if (e.key === this.LEFT || e.key === this.ARROW_LEFT) {
      this.leftPressed = true;
    }
  } // End Key Down Handler

  keyUpHandler(e) {
    if (e.key === this.RIGHT || e.key === this.ARROW_RIGHT) {
      this.rightPressed = false;
    } else if (e.key === this.LEFT || e.key === this.ARROW_LEFT) {
      this.leftPressed = false;
    }
  } // End Key Up Handler

  mouseMoveHandler(e) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.moveTo(relativeX - this.paddle.width / 2, this.paddle.y);
    }
  } // End Mouse Move Handler

  checkKeys() {
    if (this.rightPressed) {
      this.paddle.x += 7;
      if (this.paddle.x + this.paddle.width > this.canvas.width) {
        this.paddle.x = this.canvas.width - this.paddle.width;
      }
    } else if (this.leftPressed) {
      this.paddle.x -= 7;
      if (this.paddle.x < 0) {
        this.paddle.x = 0;
      }
    }
  } // End Check Keys

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bricks.render(this.ctx);
    this.ball.render(this.ctx);
    this.paddle.render(this.ctx);
    this.scoreLabel.render(this.ctx);
    this.livesLabel.render(this.ctx);
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
}

export default Game;
