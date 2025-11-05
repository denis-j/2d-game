import Phaser from 'phaser';

interface LevelData {
  name: string;
  levelNumber: number;
  width: number;
  height: number;
  tileSize: number;
  tiles: number[][];
  playerSpawn: { x: number; y: number };
  enemies: Array<{ type: string; x: number; y: number }>;
  items: Array<{ type: string; x: number; y: number }>;
  decorations: Array<{ type: string; x: number; y: number }>;
}

export class TilemapManager {
  private scene: Phaser.Scene;
  private wallLayer!: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public createLevel(levelData: LevelData): void {
    // Create groups
    this.wallLayer = this.scene.physics.add.staticGroup();

    const tileSize = levelData.tileSize;

    // Create tiles
    for (let y = 0; y < levelData.height; y++) {
      for (let x = 0; x < levelData.width; x++) {
        const tileType = levelData.tiles[y][x];
        const worldX = x * tileSize + tileSize / 2;
        const worldY = y * tileSize + tileSize / 2;

        if (tileType === 0) {
          // Floor tile
          this.createFloorTile(worldX, worldY, tileSize);
        } else if (tileType === 1) {
          // Wall tile
          this.createWallTile(worldX, worldY, tileSize);
        }
      }
    }

    // Create decorations
    levelData.decorations.forEach(decoration => {
      this.createDecoration(
        decoration.type,
        decoration.x * tileSize + tileSize / 2,
        decoration.y * tileSize + tileSize / 2
      );
    });

    // Create items
    levelData.items.forEach(item => {
      this.createItem(
        item.type,
        item.x * tileSize + tileSize / 2,
        item.y * tileSize + tileSize / 2
      );
    });
  }

  private createFloorTile(x: number, y: number, size: number): void {
    // Create floor tile with subtle variations
    const variation = Math.random() < 0.2 ? 1 : 0;
    const color = variation ? 0x3a2b1a : 0x4a3b2a;

    const tile = this.scene.add.rectangle(x, y, size, size, color);
    tile.setStrokeStyle(1, 0x2a1b0a, 0.3);
  }

  private createWallTile(x: number, y: number, size: number): void {
    // Create wall tile
    const wall = this.scene.add.rectangle(x, y, size, size, 0x8b4513);
    wall.setStrokeStyle(1, 0x654321);

    // Add to physics group for collision
    this.wallLayer.add(wall);
    const body = wall.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(size, size);
    body.updateFromGameObject();
  }

  private createDecoration(type: string, x: number, y: number): void {
    // Create decoration sprite
    const decoration = this.scene.add.sprite(x, y, type);
    decoration.setDepth(5); // Above floor, below entities

    // Add animations for torches
    if (type === 'torch_front' || type === 'torch_side') {
      // Create animation if it doesn't exist
      const animKey = `${type}_anim`;
      if (!this.scene.anims.exists(animKey)) {
        this.scene.anims.create({
          key: animKey,
          frames: this.scene.anims.generateFrameNumbers(type, { start: 0, end: 3 }),
          frameRate: 8,
          repeat: -1
        });
      }
      // Play the animation
      decoration.play(animKey);
    } else {
      // For non-animated decorations, show first frame
      decoration.setFrame(0);
    }
  }

  private createItem(type: string, x: number, y: number): void {
    // Create item sprite
    const item = this.scene.add.sprite(x, y, type);
    item.setFrame(0); // Show only first frame of spritesheet
    item.setDepth(6); // Above decorations, below entities

    // Add a subtle bounce animation to make items visible
    this.scene.tweens.add({
      targets: item,
      y: y - 2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public getWallLayer(): Phaser.GameObjects.Group {
    return this.wallLayer;
  }

  public getPlayerSpawnPosition(levelData: LevelData): { x: number; y: number } {
    return {
      x: levelData.playerSpawn.x * levelData.tileSize + levelData.tileSize / 2,
      y: levelData.playerSpawn.y * levelData.tileSize + levelData.tileSize / 2
    };
  }
}
