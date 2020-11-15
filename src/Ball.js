class Ball {
  constructor(x, y, dx = 2, dy = -2, radius = 10, color = '#FFFFFF') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    // This was a quick-fix
    this.canvasWidth = 480;
    this.PI2 = Math.PI * 2;
  }

  move() {
    if (this.x + this.dx > this.canvasWidth - this.radius || this.x + this.dx < this.radius) {
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
