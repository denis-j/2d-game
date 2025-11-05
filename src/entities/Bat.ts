import Phaser from 'phaser';
import { Enemy } from './Enemy';

export class Bat extends Enemy {
  private waveAmplitude: number = 30;
  private waveFrequency: number = 2;
  private waveOffset: number;
  private baseY: number;
  private directionChangeTimer: number = 0;
  private directionChangeInterval: number = 3000;
  private currentDirection: number = 1; // 1 for right, -1 for left

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Bat stats
    const hp = 20;
    const damage = 15;
    const speed = 60;

    super(scene, x, y, 'bat', hp, damage, speed);

    this.baseY = y;
    this.waveOffset = Math.random() * Math.PI * 2; // Random starting wave position

    // Create animation
    this.createAnimation();
    this.sprite.play('bat_fly');
  }

  private createAnimation(): void {
    // Check if animation already exists
    if (this.scene.anims.exists('bat_fly')) {
      return;
    }

    this.scene.anims.create({
      key: 'bat_fly',
      frames: this.scene.anims.generateFrameNumbers('bat', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
  }

  public update(time: number, delta: number, _playerPos: { x: number; y: number }): void {
    if (this.isDead) return;

    // Update direction change timer
    this.directionChangeTimer += delta;
    if (this.directionChangeTimer >= this.directionChangeInterval) {
      this.directionChangeTimer = 0;
      this.currentDirection *= -1; // Reverse direction
    }

    // Wave motion
    const timeInSeconds = time / 1000;
    const waveY = Math.sin(timeInSeconds * this.waveFrequency + this.waveOffset) * this.waveAmplitude;

    // Horizontal movement
    const velocityX = this.speed * this.currentDirection;

    // Set target position
    const targetY = this.baseY + waveY;
    const velocityY = (targetY - this.sprite.y) * 2; // Smooth movement to target Y

    this.sprite.setVelocity(velocityX, velocityY);

    // Flip sprite based on direction
    this.sprite.setFlipX(this.currentDirection < 0);
  }
}
