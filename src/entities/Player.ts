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

  // Lives system
  private lives: number = 3;
  private maxLives: number = 3;
  private isDead: boolean = false;
  private isRespawning: boolean = false;
  private spawnX: number;
  private spawnY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.spawnX = x;
    this.spawnY = y;

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
    // Idle animations (4 directions) - only 1 frame per direction
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

    // Walk animations (4 directions) - only 1 frame per direction
    // Since there's only 1 frame per direction, we'll use the same frame for walking
    this.scene.anims.create({
      key: 'knight_walk_down',
      frames: this.scene.anims.generateFrameNumbers('knight_walk', { start: 0, end: 0 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'knight_walk_up',
      frames: this.scene.anims.generateFrameNumbers('knight_walk', { start: 1, end: 1 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'knight_walk_right',
      frames: this.scene.anims.generateFrameNumbers('knight_walk', { start: 2, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'knight_walk_left',
      frames: this.scene.anims.generateFrameNumbers('knight_walk', { start: 3, end: 3 }),
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
    } else if (input.right) {
      velocityX = this.speed;
    }

    if (input.up) {
      velocityY = -this.speed;
    } else if (input.down) {
      velocityY = this.speed;
    }

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    // Set velocity
    this.sprite.setVelocity(velocityX, velocityY);

    // Determine animation direction
    let animDirection = '';
    const isMoving = velocityX !== 0 || velocityY !== 0;
    let flipX = false;

    if (isMoving) {
      // Update last direction based on actual movement
      // Prioritize horizontal over vertical for diagonal movement
      if (velocityX < 0 && Math.abs(velocityX) >= Math.abs(velocityY)) {
        animDirection = 'right'; // Use right sprite, but flip it
        flipX = true;
        this.lastDirection = { x: -1, y: 0 };
      } else if (velocityX > 0 && Math.abs(velocityX) >= Math.abs(velocityY)) {
        animDirection = 'right';
        flipX = false;
        this.lastDirection = { x: 1, y: 0 };
      } else if (velocityY < 0) {
        animDirection = 'up';
        flipX = false;
        this.lastDirection = { x: 0, y: -1 };
      } else if (velocityY > 0) {
        animDirection = 'down';
        flipX = false;
        this.lastDirection = { x: 0, y: 1 };
      }
    } else {
      // Not moving, use last direction for idle
      if (this.lastDirection.x < 0) {
        animDirection = 'right'; // Use right sprite, but flip it
        flipX = true;
      } else if (this.lastDirection.x > 0) {
        animDirection = 'right';
        flipX = false;
      } else if (this.lastDirection.y < 0) {
        animDirection = 'up';
        flipX = false;
      } else {
        animDirection = 'down';
        flipX = false;
      }
    }

    // Update sprite flip
    this.sprite.setFlipX(flipX);

    // Update animation
    if (!this.isAttacking && animDirection) {
      const animKey = isMoving ? `knight_walk_${animDirection}` : `knight_idle_${animDirection}`;
      this.sprite.play(animKey, true);
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
    if (this.isDead || this.isRespawning) return;

    this.hp -= amount;
    if (this.hp < 0) {
      this.hp = 0;
    }

    // Visual feedback - flash red
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.sprite && this.sprite.active) {
        this.sprite.clearTint();
      }
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
    if (this.isDead) return;

    this.isDead = true;
    this.lives--;

    // Stop all movement
    this.sprite.setVelocity(0, 0);

    // Death animation - fade out and rotate
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      angle: 360,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        if (this.lives > 0) {
          // Respawn if lives remaining
          this.scene.time.delayedCall(1000, () => {
            this.respawn();
          });
        } else {
          // Game Over
          this.scene.events.emit('player-game-over');
        }
      }
    });
  }

  private respawn(): void {
    this.isRespawning = true;

    // Reset HP
    this.hp = this.maxHp;

    // Teleport to spawn
    this.sprite.setPosition(this.spawnX, this.spawnY);
    this.sprite.setAlpha(0);
    this.sprite.setAngle(0);

    // Fade in animation
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 1,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.isDead = false;
        this.isRespawning = false;
      }
    });

    // Invulnerability flash effect for 3 seconds
    let flashCount = 0;
    const flashInterval = this.scene.time.addEvent({
      delay: 200,
      repeat: 14, // 3 seconds
      callback: () => {
        if (this.sprite && this.sprite.active) {
          this.sprite.setAlpha(flashCount % 2 === 0 ? 0.5 : 1);
          flashCount++;
        }
      }
    });

    // End invulnerability
    this.scene.time.delayedCall(3000, () => {
      if (this.sprite && this.sprite.active) {
        this.sprite.setAlpha(1);
      }
      flashInterval.destroy();
    });

    // Notify scene
    this.scene.events.emit('player-respawned');
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

  public getLives(): number {
    return this.lives;
  }

  public getMaxLives(): number {
    return this.maxLives;
  }

  public isPlayerDead(): boolean {
    return this.isDead;
  }
}
