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
  private coins: number = 0;
  private keys: Set<string> = new Set(); // Track collected keys

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Set background color
    this.cameras.main.setBackgroundColor('#1a1a1a');

    // Load the JSON map data
    const mapData = this.cache.json.get('level1_map');
    
    // Create tilemap system
    this.tilemapManager = new TilemapManager(this);
    this.tilemapManager.createLevelFromJson(mapData, 'level1_tiles');

    // Get player spawn position (center of map)
    const spawnPos = this.tilemapManager.getDefaultPlayerSpawn(mapData);

    // Create player at spawn position
    this.player = new Player(this, spawnPos.x, spawnPos.y);

    // Setup collision between player and walls
    this.physics.add.collider(this.player.sprite, this.tilemapManager.getWallLayer());

    // Setup item collection (overlap, not collision - player can walk over them)
    this.physics.add.overlap(
      this.player.sprite,
      this.tilemapManager.getItemsGroup(),
      this.handleItemPickup,
      undefined,
      this
    );

    // Spawn enemies (disabled for now - map doesn't have enemy data yet)
    // this.spawnEnemies();

    // Setup camera to follow player
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.setZoom(2.5); // Zoom in for pixel art
    this.cameras.main.setBounds(0, 0, mapData.mapWidth * mapData.tileSize, mapData.mapHeight * mapData.tileSize);

    // Create HUD
    this.hud = new GameHUD(this);
    this.hud.updateHP(this.player.getHp(), this.player.getMaxHp());
    this.hud.updateLives(this.player.getLives());
    this.hud.setLevel(1, 'Level 1');

    // Setup player events
    this.events.on('player-game-over', () => {
      this.scene.start('GameOverScene');
    });

    this.events.on('player-respawned', () => {
      this.hud.updateLives(this.player.getLives());
      this.hud.updateHP(this.player.getHp(), this.player.getMaxHp());
    });

    this.events.on('player-took-damage', (lives: number) => {
      this.hud.updateLives(lives);
      this.hud.updateHP(this.player.getHp(), this.player.getMaxHp());
    });

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

    // Dev Tool: Tileset Viewer (T key)
    const tKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    tKey.on('down', () => {
      this.scene.pause('GameScene');
      this.scene.launch('TilesetViewerScene');
    });
  }

  private handleItemPickup(
    playerSprite: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    itemSprite: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    const item = itemSprite as Phaser.GameObjects.Sprite;
    const itemType = item.getData('itemType') as string;
    
    console.log('🎁 Item pickup triggered:', itemType);

    // Handle different item types
    if (itemType === 'bronze_coin' || itemType === 'silver_coin' || itemType === 'gold_coin') {
      // Add coins
      let coinValue = 1;
      if (itemType === 'silver_coin') coinValue = 5;
      if (itemType === 'gold_coin') coinValue = 10;
      
      this.coins += coinValue;
      console.log(`💰 Collected ${itemType}! Total coins: ${this.coins}`);
    } else if (itemType === 'red_potion' || itemType === 'blue_potion' || itemType === 'green_potion') {
      // Heal player
      const healAmount = 30;
      this.player.heal(healAmount);
      this.hud.updateHP(this.player.getHp(), this.player.getMaxHp());
      console.log(`🧪 Collected ${itemType}! +${healAmount} HP`);
    } else if (itemType === 'bronze_key' || itemType === 'silver_key' || itemType === 'gold_key') {
      // Collect key
      this.keys.add(itemType);
      console.log(`🔑 Collected ${itemType}! Keys: ${Array.from(this.keys).join(', ')}`);
    }

    // Collect animation (fade out and scale down)
    this.tweens.add({
      targets: item,
      alpha: 0,
      scale: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        item.destroy();
      }
    });

    // Play pickup sound (if available)
    // this.sound.play('pickup');
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

    // Check if player is at a locked door
    if (this.player.sprite.body && (left || right || up || down)) {
      const requiredKey = this.tilemapManager.getLockedDoorAt(
        this.player.sprite.x,
        this.player.sprite.y
      );
      
      if (requiredKey) {
        // Player is at a locked door
        if (this.keys.has(requiredKey)) {
          // Player has the key! Open the door
          this.tilemapManager.tryOpenDoor(
            this.player.sprite.x,
            this.player.sprite.y,
            requiredKey
          );
        }
      }
    }

    // Update enemies
    const playerPos = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.enemies.forEach(enemy => {
      enemy.update(time, delta, playerPos);
    });
  }
}
