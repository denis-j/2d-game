import { Player } from './Player';
import { Platform } from './Platform';

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  platforms: Platform[];
  keys: Set<string>;
  animationId: number | null;
  score: number;
  gameTime: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.width = 800;
    this.canvas.height = 600;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = ctx;

    this.player = new Player(100, 100);
    this.platforms = this.createPlatforms();
    this.keys = new Set();
    this.animationId = null;
    this.score = 0;
    this.gameTime = 0;

    this.setupEventListeners();
  }

  createPlatforms(): Platform[] {
    return [
      new Platform(150, 450, 200, 20),
      new Platform(450, 380, 150, 20),
      new Platform(250, 300, 180, 20),
      new Platform(500, 220, 200, 20),
      new Platform(100, 150, 150, 20),
    ];
  }

  setupEventListeners(): void {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key);
      // Verhindere Scrollen mit Pfeiltasten
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key);
    });
  }

  update(): void {
    this.player.update(this.keys, this.canvas);

    // Plattform-Kollisionen prüfen
    for (const platform of this.platforms) {
      platform.handleCollision(this.player);
    }

    this.gameTime++;
    if (this.gameTime % 60 === 0) {
      this.score++;
    }
  }

  draw(): void {
    // Hintergrund löschen
    this.ctx.fillStyle = '#16213e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Plattformen zeichnen
    for (const platform of this.platforms) {
      platform.draw(this.ctx);
    }

    // Spieler zeichnen
    this.player.draw(this.ctx);

    // Score anzeigen
    this.ctx.fillStyle = '#0ea5e9';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 20, 30);
  }

  gameLoop = (): void => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  start(): void {
    this.gameLoop();
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
