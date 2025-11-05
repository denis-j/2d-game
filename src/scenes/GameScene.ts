import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { TilemapManager } from '../systems/TilemapManager';
import { Level5Data } from '../levels/Level5Data';
import { Slime } from '../entities/Slime';
import { Bat } from '../entities/Bat';
import { Enemy } from '../entities/Enemy';
import { GameHUD } from '../ui/GameHUD';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private tilemapManager!: TilemapManager;
  private enemies: Enemy[] = [];
  private hud!: GameHUD;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Set background color
    this.cameras.main.setBackgroundColor('#1a1a1a');

    // Create tilemap system
    this.tilemapManager = new TilemapManager(this);
    this.tilemapManager.createLevel(Level5Data);

    // Get player spawn position
    const spawnPos = this.tilemapManager.getPlayerSpawnPosition(Level5Data);

    // Create player at spawn position
    this.player = new Player(this, spawnPos.x, spawnPos.y);

    // Setup collision between player and walls
    this.physics.add.collider(this.player.sprite, this.tilemapManager.getWallLayer());

    // Spawn enemies
    this.spawnEnemies();

    // Setup camera to follow player
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.setZoom(2.5); // Zoom in for pixel art
    this.cameras.main.setBounds(0, 0, Level5Data.width * Level5Data.tileSize, Level5Data.height * Level5Data.tileSize);

    // Create HUD
    this.hud = new GameHUD(this);
    this.hud.updateHP(this.player.getHp(), this.player.getMaxHp());
    this.hud.setLevel(Level5Data.levelNumber, Level5Data.name);

    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // Setup attack key (Space)
    const spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.on('down', () => {
      this.performPlayerAttack();
    });
  }

  private performPlayerAttack(): void {
    this.player.attack();

    // Check for enemies hit by attack (delayed to sync with attack animation)
    this.time.delayedCall(50, () => {
      const attackRange = 25;
      const attackX = this.player.sprite.x + this.player.lastDirection.x * attackRange;
      const attackY = this.player.sprite.y + this.player.lastDirection.y * attackRange;

      this.enemies.forEach(enemy => {
        if (enemy.isDying()) return;

        const distance = Phaser.Math.Distance.Between(
          attackX,
          attackY,
          enemy.sprite.x,
          enemy.sprite.y
        );

        if (distance <= attackRange) {
          enemy.takeDamage(this.player.getDamage());
        }
      });
    });
  }

  private spawnEnemies(): void {
    const tileSize = Level5Data.tileSize;

    Level5Data.enemies.forEach(enemyData => {
      const worldX = enemyData.x * tileSize + tileSize / 2;
      const worldY = enemyData.y * tileSize + tileSize / 2;

      let enemy: Enemy;

      if (enemyData.type === 'slime_green') {
        enemy = new Slime(this, worldX, worldY, 'green');
      } else if (enemyData.type === 'slime_blue') {
        enemy = new Slime(this, worldX, worldY, 'blue');
      } else if (enemyData.type === 'slime_red') {
        enemy = new Slime(this, worldX, worldY, 'red');
      } else if (enemyData.type === 'bat') {
        enemy = new Bat(this, worldX, worldY);
      } else {
        return;
      }

      this.enemies.push(enemy);

      // Setup collision with walls
      this.physics.add.collider(enemy.sprite, this.tilemapManager.getWallLayer());

      // Setup collision with player (damage player on contact)
      this.physics.add.overlap(this.player.sprite, enemy.sprite, () => {
        this.handlePlayerEnemyCollision(enemy);
      });
    });
  }

  private handlePlayerEnemyCollision(enemy: Enemy): void {
    if (enemy.isDying()) return;

    // Player takes damage
    this.player.takeDamage(enemy.getDamage());

    // Update HUD
    this.hud.updateHP(this.player.getHp(), this.player.getMaxHp());

    // Knockback effect (optional)
    const angle = Phaser.Math.Angle.Between(
      enemy.sprite.x,
      enemy.sprite.y,
      this.player.sprite.x,
      this.player.sprite.y
    );
    const knockbackForce = 100;
    this.player.sprite.setVelocity(
      Math.cos(angle) * knockbackForce,
      Math.sin(angle) * knockbackForce
    );
  }

  update(time: number, delta: number): void {
    // Get input
    const left = this.cursors.left.isDown || this.wasdKeys.A.isDown;
    const right = this.cursors.right.isDown || this.wasdKeys.D.isDown;
    const up = this.cursors.up.isDown || this.wasdKeys.W.isDown;
    const down = this.cursors.down.isDown || this.wasdKeys.S.isDown;

    // Update player
    this.player.update(time, delta, { left, right, up, down });

    // Update enemies
    const playerPos = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.enemies.forEach(enemy => {
      enemy.update(time, delta, playerPos);
    });
  }
}
