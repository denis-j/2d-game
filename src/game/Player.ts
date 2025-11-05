export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  velocityX: number;
  speed: number;
  jumpPower: number;
  gravity: number;
  isOnGround: boolean;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.velocityY = 0;
    this.velocityX = 0;
    this.speed = 5;
    this.jumpPower = 12;
    this.gravity = 0.5;
    this.isOnGround = false;
    this.color = '#0ea5e9';
  }

  update(keys: Set<string>, canvas: HTMLCanvasElement): void {
    // Horizontale Bewegung
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
      this.velocityX = -this.speed;
    } else if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
      this.velocityX = this.speed;
    } else {
      this.velocityX = 0;
    }

    // Springen
    if ((keys.has('ArrowUp') || keys.has('w') || keys.has('W') || keys.has(' ')) && this.isOnGround) {
      this.velocityY = -this.jumpPower;
      this.isOnGround = false;
    }

    // Schwerkraft anwenden
    this.velocityY += this.gravity;

    // Position aktualisieren
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Boden-Kollision
    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.isOnGround = true;
    }

    // Wand-Kollisionen
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Augen
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x + 10, this.y + 10, 8, 8);
    ctx.fillRect(this.x + 22, this.y + 10, 8, 8);

    // Pupillen
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.x + 13, this.y + 13, 4, 4);
    ctx.fillRect(this.x + 25, this.y + 13, 4, 4);
  }
}
