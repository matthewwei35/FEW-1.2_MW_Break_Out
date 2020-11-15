/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */

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
// GAME
// --------------------------------------------------------
const game = new Game('myCanvas');
