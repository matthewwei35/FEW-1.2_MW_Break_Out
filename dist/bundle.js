/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
eval("/* eslint-disable no-shadow */\n/* eslint-disable max-classes-per-file */\n/* eslint-disable import/extensions */\n/* eslint-disable no-use-before-define */\n/* eslint-disable no-alert */\n\n// --------------------------------------------------------\n// CONSTANTS\n// --------------------------------------------------------\nconst paddleHeight = 10;\nconst paddleWidth = 75;\nconst paddleXStart = (canvas.width - paddleWidth) / 2;\nconst paddleYStart = canvas.height - paddleHeight;\n\nconst brickRowCount = 5;\nconst brickColumnCount = 7;\n\nconst ARROW_RIGHT = 'ArrowRight';\nconst ARROW_LEFT = 'ArrowLeft';\nconst RIGHT = 'RIGHT';\nconst LEFT = 'LEFT';\n\nconst gameOverMessage = 'GAME OVER';\nconst winMessage = 'YOU WIN, CONGRATULATIONS!';\n\n// --------------------------------------------------------\n// GAME\n// --------------------------------------------------------\nconst game = new Game('myCanvas');\n\n\n//# sourceURL=webpack://Break_Out/./src/main.js?");
/******/ })()
;