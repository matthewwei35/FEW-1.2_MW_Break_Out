// --------------------------------------------------------
// GAME LABEL
// --------------------------------------------------------

import Sprite from './Sprite';

class GameLabel extends Sprite {
  constructor(text, x, y, color = '#FCAF3B', font = '16px Helvetica') {
    super(x, y, 0, 0, color);
    this.text = text;
    this.font = font;
    this.value = 0;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`${this.text} ${this.value}`, this.x, this.y);
  }
}

export default GameLabel;
