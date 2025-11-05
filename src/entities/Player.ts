import Phaser from 'phaser';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private speed: number = 120;
  private hp: number = 100;
  private maxHp: number = 100;
  private damage: number = 20;
  private isAttacking: boolean = false;
  private attackCooldown: number = 0;
  public lastDirection: { x: number; y: number } = { x: 0, y: -1 }; // Default facing up

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // Create sprite with physics
    this.sprite = scene.physics.add.sprite(x, y, 'knight_idle');
    this.sprite.setSize(12, 14); // Adjust hitbox
    this.sprite.setOffset(2, 2);

    // Create animations
    this.createAnimations();

    // Play idle animation
    this.sprite.play('knight_idle_down');
  }

  private createAnimations(): void {
    // Idle animations (4 directions)
    this.scene.anims.create({
      key: 'knight_idle_down',
      frames: this.scene.anims.generateFrameNumbers('knight_idle', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'knight_idle_up',
      frames: this.scene.anims.generateFrameNumbers('knight_idle', { start: 1, end: 1 }),
      frameRate: 1,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'knight_idle_right',
      frames: this.scene.anims.generateFrameNumbers('knight_idle', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'knight_idle_left',
      frames: this.scene.anims.generateFrameNumbers('knight_idle', { start: 3, end: 3 }),
      frameRate: 1,
      repeat: -1
    });

    // Walk animations (4 directions)
    this.scene.anims.create({
      key: 'knight_walk_down',
      frames: this.scene.anims.generateFrameNumbers('knight_walk', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'knight_walk_up',
      frames: this.scene.anims.generateFrameNumbers('knight_walk', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'knight_walk_right',
      frames: this.scene.anims.generateFrameNumbers('knight_walk', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'knight_walk_left',
      frames: this.scene.anims.generateFrameNumbers('knight_walk', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1
    });
  }

  public update(_time: number, delta: number, input: { left: boolean; right: boolean; up: boolean; down: boolean }): void {
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }

    // Handle movement
    let velocityX = 0;
    let velocityY = 0;

    if (input.left) {
      velocityX = -this.speed;
      this.lastDirection = { x: -1, y: 0 };
    } else if (input.right) {
      velocityX = this.speed;
      this.lastDirection = { x: 1, y: 0 };
    }

    if (input.up) {
      velocityY = -this.speed;
      this.lastDirection = { x: 0, y: -1 };
    } else if (input.down) {
      velocityY = this.speed;
      this.lastDirection = { x: 0, y: 1 };
    }

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    // Set velocity
    this.sprite.setVelocity(velocityX, velocityY);

    // Update animation
    if (!this.isAttacking) {
      if (velocityX === 0 && velocityY === 0) {
        // Idle
        if (this.lastDirection.x < 0) {
          this.sprite.play('knight_idle_left', true);
        } else if (this.lastDirection.x > 0) {
          this.sprite.play('knight_idle_right', true);
        } else if (this.lastDirection.y < 0) {
          this.sprite.play('knight_idle_up', true);
        } else {
          this.sprite.play('knight_idle_down', true);
        }
      } else {
        // Walking
        if (input.left) {
          this.sprite.play('knight_walk_left', true);
        } else if (input.right) {
          this.sprite.play('knight_walk_right', true);
        } else if (input.up) {
          this.sprite.play('knight_walk_up', true);
        } else if (input.down) {
          this.sprite.play('knight_walk_down', true);
        }
      }
    }
  }

  public attack(): void {
    if (this.attackCooldown > 0 || this.isAttacking) {
      return;
    }

    this.isAttacking = true;
    this.attackCooldown = 500; // 0.5 second cooldown

    // Create attack hitbox in front of player
    const attackRange = 20;
    const attackX = this.sprite.x + this.lastDirection.x * attackRange;
    const attackY = this.sprite.y + this.lastDirection.y * attackRange;

    // Visual feedback (sword slash effect)
    const attackIndicator = this.scene.add.circle(attackX, attackY, 10, 0xffff00, 0.7);
    const attackIndicator2 = this.scene.add.circle(attackX, attackY, 8, 0xff0000, 0.5);

    this.scene.tweens.add({
      targets: [attackIndicator, attackIndicator2],
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        attackIndicator.destroy();
        attackIndicator2.destroy();
      }
    });

    // Check for enemies in attack range using an overlap check
    const attackHitbox = this.scene.add.circle(attackX, attackY, 16);
    this.scene.physics.add.existing(attackHitbox);

    // Store the attack data on the hitbox
    attackHitbox.setData('damage', this.damage);
    attackHitbox.setData('player', this);

    // Destroy hitbox after a short duration
    this.scene.time.delayedCall(100, () => {
      attackHitbox.destroy();
    });

    // Reset attack state
    this.scene.time.delayedCall(200, () => {
      this.isAttacking = false;
    });
  }

  public getAttackHitbox(): Phaser.GameObjects.GameObject | null {
    // This will be used by the scene to check for enemy hits
    return null; // Handled directly in attack() now
  }

  public takeDamage(amount: number): void {
    this.hp -= amount;
    if (this.hp < 0) {
      this.hp = 0;
    }

    // Visual feedback - flash red
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.sprite.clearTint();
    });

    if (this.hp === 0) {
      this.die();
    }
  }

  public heal(amount: number): void {
    this.hp += amount;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
  }

  private die(): void {
    // TODO: Implement death logic
    console.log('Player died!');
  }

  public getHp(): number {
    return this.hp;
  }

  public getMaxHp(): number {
    return this.maxHp;
  }

  public getDamage(): number {
    return this.damage;
  }
}
