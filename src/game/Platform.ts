export class Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = '#e94560';
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Highlight-Effekt
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(this.x, this.y, this.width, 3);
  }

  checkCollision(player: { x: number; y: number; width: number; height: number; velocityY: number }): boolean {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }

  handleCollision(player: { x: number; y: number; width: number; height: number; velocityY: number; isOnGround: boolean }): void {
    if (this.checkCollision(player)) {
      // Von oben auf die Plattform springen
      if (player.velocityY > 0 && player.y + player.height - player.velocityY <= this.y) {
        player.y = this.y - player.height;
        player.velocityY = 0;
        player.isOnGround = true;
      }
    }
  }
}
