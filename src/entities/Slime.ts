import Phaser from 'phaser';
import { Enemy } from './Enemy';

export type SlimeType = 'green' | 'blue' | 'red';

export class Slime extends Enemy {
  private slimeType: SlimeType;
  private moveTimer: number = 0;
  private moveInterval: number;
  private aggroRange: number;

  constructor(scene: Phaser.Scene, x: number, y: number, type: SlimeType) {
    // Set stats based on slime type
    let hp: number, damage: number, speed: number, aggroRange: number;

    switch (type) {
      case 'green': // Easy
        hp = 30;
        damage = 10;
        speed = 30;
        aggroRange = 0; // Passive
        break;
      case 'blue': // Medium
        hp = 40;
        damage = 15;
        speed = 50;
        aggroRange = 100;
        break;
      case 'red': // Hard
        hp = 50;
        damage = 20;
        speed = 70;
        aggroRange = 150;
        break;
    }

    const texture = `slime_${type}`;
    super(scene, x, y, texture, hp, damage, speed);

    this.slimeType = type;
    this.aggroRange = aggroRange;
    this.moveInterval = 2000; // Change direction every 2 seconds for passive slimes

    // Create animations
    this.createAnimations();
    this.sprite.play(`slime_${type}_idle`);
  }

  private createAnimations(): void {
    const key = `slime_${this.slimeType}`;
    const animKey = `slime_${this.slimeType}_idle`;

    // Check if animation already exists
    if (this.scene.anims.exists(animKey)) {
      return;
    }

    // Idle/move animation (slimes don't have walk animations, just bounce)
    this.scene.anims.create({
      key: animKey,
      frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });
  }

  public update(_time: number, delta: number, playerPos: { x: number; y: number }): void {
    if (this.isDead) return;

    // Calculate distance to player
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      playerPos.x,
      playerPos.y
    );

    if (this.slimeType === 'green') {
      // Green slime: Random wandering
      this.moveTimer += delta;
      if (this.moveTimer >= this.moveInterval) {
        this.moveTimer = 0;
        this.wanderRandomly();
      }
    } else if (distanceToPlayer <= this.aggroRange) {
      // Blue and Red slimes: Chase player when in range
      this.chasePlayer(playerPos);
    } else {
      // Out of range: slow down
      this.sprite.setVelocity(0, 0);
    }
  }

  private wanderRandomly(): void {
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.sprite.setVelocity(velocityX, velocityY);
  }

  private chasePlayer(playerPos: { x: number; y: number }): void {
    // Calculate direction to player
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      playerPos.x,
      playerPos.y
    );

    // Set velocity towards player
    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;

    this.sprite.setVelocity(velocityX, velocityY);
  }
}
