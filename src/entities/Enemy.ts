import Phaser from 'phaser';

export abstract class Enemy {
  public sprite: Phaser.Physics.Arcade.Sprite;
  protected scene: Phaser.Scene;
  protected hp: number;
  protected maxHp: number;
  protected damage: number;
  protected speed: number;
  protected isDead: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, hp: number, damage: number, speed: number) {
    this.scene = scene;
    this.hp = hp;
    this.maxHp = hp;
    this.damage = damage;
    this.speed = speed;

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setSize(12, 12);
    this.sprite.setOffset(2, 2);
    this.sprite.setDepth(10); // Above tiles

    // Store reference to this enemy in the sprite
    this.sprite.setData('enemy', this);
  }

  public abstract update(time: number, delta: number, playerPos: { x: number; y: number }): void;

  public takeDamage(amount: number): void {
    if (this.isDead) return;

    this.hp -= amount;

    // Visual feedback - flash red
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.sprite && this.sprite.active) {
        this.sprite.clearTint();
      }
    });

    if (this.hp <= 0) {
      this.die();
    }
  }

  protected die(): void {
    if (this.isDead) return;

    this.isDead = true;

    // Death animation - fade out
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.sprite.destroy();
      }
    });

    // TODO: Drop items (coins, potions)
  }

  public getDamage(): number {
    return this.damage;
  }

  public isDying(): boolean {
    return this.isDead;
  }
}
