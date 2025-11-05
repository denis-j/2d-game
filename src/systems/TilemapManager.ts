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

interface MapJsonTile {
  id: string;
  x: number;
  y: number;
}

interface MapJsonLayer {
  name: string;
  tiles: MapJsonTile[];
  collider: boolean;
}

interface MapJsonItem {
  type: string;
  x: number;
  y: number;
}

interface MapJsonDoor {
  x: number;
  y: number;
  requiredKey: string; // e.g., "bronze_key", "silver_key", "gold_key"
}

interface MapJson {
  tileSize: number;
  mapWidth: number;
  mapHeight: number;
  playerSpawn?: { x: number; y: number };
  layers: MapJsonLayer[];
  decorations?: MapJsonItem[];
  items?: MapJsonItem[];
  doors?: MapJsonDoor[];
}

export class TilemapManager {
  private scene: Phaser.Scene;
  private wallLayer!: Phaser.GameObjects.Group;
  private itemsGroup!: Phaser.GameObjects.Group;
  private decorationsGroup!: Phaser.GameObjects.Group;
  private doors: Map<string, { sprite: Phaser.GameObjects.Sprite; requiredKey: string; isOpen: boolean }> = new Map();

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
      this.createCollectibleItem(
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

  public getWallLayer(): Phaser.GameObjects.Group {
    return this.wallLayer;
  }

  public getPlayerSpawnPosition(levelData: LevelData): { x: number; y: number } {
    return {
      x: levelData.playerSpawn.x * levelData.tileSize + levelData.tileSize / 2,
      y: levelData.playerSpawn.y * levelData.tileSize + levelData.tileSize / 2
    };
  }

  /**
   * Create level from JSON map data
   */
  public createLevelFromJson(mapData: MapJson, tilesetKey: string): void {
    // Create groups
    this.wallLayer = this.scene.physics.add.staticGroup();
    this.decorationsGroup = this.scene.add.group();
    this.itemsGroup = this.scene.add.group();

    const tileSize = mapData.tileSize;
    const floorVariations = [95, 96, 97, 98, 99, 100];

    // First: Render floor tiles everywhere
    for (let y = 0; y < mapData.mapHeight; y++) {
      for (let x = 0; x < mapData.mapWidth; x++) {
        const worldX = x * tileSize + tileSize / 2;
        const worldY = y * tileSize + tileSize / 2;
        
        const randomIndex = floorVariations[Math.floor(Math.random() * floorVariations.length)];
        const floorSprite = this.scene.add.sprite(worldX, worldY, 'dungeon_tiles', randomIndex);
        floorSprite.setDepth(0);
      }
    }

    // Second: Render building/wall layers on top
    mapData.layers.forEach((layer) => {
      if (layer.name === 'Boden') return; // Skip floor layer (already rendered)

      layer.tiles.forEach((tile) => {
        const tileId = parseInt(tile.id);
        const worldX = tile.x * tileSize + tileSize / 2;
        const worldY = tile.y * tileSize + tileSize / 2;

        // Check if this tile is a door
        const door = mapData.doors?.find(d => d.x === tile.x && d.y === tile.y);
        
        if (door) {
          // This is a door - create it specially
          const doorSprite = this.scene.add.sprite(worldX, worldY, tilesetKey, tileId);
          doorSprite.setDepth(1);
          doorSprite.setData('isDoor', true);
          doorSprite.setData('doorKey', `${tile.x}_${tile.y}`);
          
          // Add to wall layer for collision (initially closed)
          this.wallLayer.add(doorSprite);
          const body = doorSprite.body as Phaser.Physics.Arcade.StaticBody;
          body.setSize(tileSize, tileSize);
          body.updateFromGameObject();
          
          // Store in doors map
          this.doors.set(`${tile.x}_${tile.y}`, {
            sprite: doorSprite,
            requiredKey: door.requiredKey,
            isOpen: false
          });
          
          console.log(`🚪 Door created at (${tile.x}, ${tile.y}) - requires ${door.requiredKey}`);
        } else {
          // Regular wall tile
          const sprite = this.scene.add.sprite(worldX, worldY, tilesetKey, tileId);
          sprite.setDepth(1);

          // Add collision for this tile
          this.wallLayer.add(sprite);
          const body = sprite.body as Phaser.Physics.Arcade.StaticBody;
          body.setSize(tileSize, tileSize);
          body.updateFromGameObject();
        }
      });
    });

    // Third: Render decorations (no collision - torches, bones, etc.)
    if (mapData.decorations) {
      mapData.decorations.forEach((decoration) => {
        this.createDecoration(
          decoration.type,
          decoration.x * tileSize + tileSize / 2,
          decoration.y * tileSize + tileSize / 2
        );
      });
    }

    // Fourth: Render collectible items (coins, potions, etc.)
    if (mapData.items) {
      mapData.items.forEach((item) => {
        this.createCollectibleItem(
          item.type,
          item.x * tileSize + tileSize / 2,
          item.y * tileSize + tileSize / 2
        );
      });
    }

    console.log('✅ Level created from JSON:', {
      width: mapData.mapWidth,
      height: mapData.mapHeight,
      tileSize: mapData.tileSize,
      layers: mapData.layers.length,
      decorations: mapData.decorations?.length || 0,
      items: mapData.items?.length || 0,
      itemsGroupSize: this.itemsGroup.getChildren().length
    });
  }

  /**
   * Create decoration (no collision)
   */
  private createDecoration(type: string, x: number, y: number): void {
    const decoration = this.scene.add.sprite(x, y, type, 0);
    decoration.setDepth(2); // Above floor and walls, below player

    // Add to decorations group
    this.decorationsGroup.add(decoration);

    // Animate torches
    if (type === 'torch_front' || type === 'torch_side') {
      const animKey = `${type}_anim`;
      
      // Create animation if it doesn't exist
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
    }
  }

  /**
   * Create collectible item (with pickup logic)
   */
  private createCollectibleItem(type: string, x: number, y: number): void {
    // Create physics sprite so overlap detection works
    const item = this.scene.physics.add.sprite(x, y, type, 0);
    item.setDepth(3); // Above decorations, below player
    item.setData('collectible', true);
    item.setData('itemType', type);
    
    // Disable physics body collision (player should walk through)
    item.body!.enable = true;
    (item.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Add to items group
    this.itemsGroup.add(item);

    // Add a subtle bounce animation
    this.scene.tweens.add({
      targets: item,
      y: y - 2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Get items group for collision detection
   */
  public getItemsGroup(): Phaser.GameObjects.Group {
    return this.itemsGroup;
  }

  /**
   * Try to open a door at the player's position
   */
  public tryOpenDoor(playerX: number, playerY: number, keyType: string): boolean {
    // Check all doors
    for (const [doorKey, doorData] of this.doors.entries()) {
      if (doorData.isOpen) continue; // Already open
      
      const doorX = doorData.sprite.x;
      const doorY = doorData.sprite.y;
      
      // Check if player is close enough to this door (within 20 pixels)
      const distance = Phaser.Math.Distance.Between(playerX, playerY, doorX, doorY);
      
      if (distance < 20) {
        // Player is at this door
        if (doorData.requiredKey === keyType) {
          // Correct key! Open the door
          this.openDoor(doorKey);
          return true;
        } else {
          // Wrong key or no key
          console.log(`🔒 This door requires: ${doorData.requiredKey}`);
          return false;
        }
      }
    }
    
    return false;
  }

  /**
   * Open a door
   */
  private openDoor(doorKey: string): void {
    const doorData = this.doors.get(doorKey);
    if (!doorData || doorData.isOpen) return;
    
    // Mark as open
    doorData.isOpen = true;
    
    // Remove from wall layer (no more collision)
    this.wallLayer.remove(doorData.sprite);
    
    // Visual feedback: fade out and slide up
    this.scene.tweens.add({
      targets: doorData.sprite,
      alpha: 0,
      y: doorData.sprite.y - 16,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        doorData.sprite.destroy();
      }
    });
    
    // Play sound if available
    // this.scene.sound.play('door_open');
    
    console.log(`✅ Door opened with key!`);
  }

  /**
   * Check if player is standing at a locked door
   */
  public getLockedDoorAt(playerX: number, playerY: number): string | null {
    for (const [doorKey, doorData] of this.doors.entries()) {
      if (doorData.isOpen) continue;
      
      const doorX = doorData.sprite.x;
      const doorY = doorData.sprite.y;
      const distance = Phaser.Math.Distance.Between(playerX, playerY, doorX, doorY);
      
      if (distance < 20) {
        return doorData.requiredKey;
      }
    }
    return null;
  }

  /**
   * Get player spawn for JSON maps (from map data or center as fallback)
   */
  public getDefaultPlayerSpawn(mapData: MapJson): { x: number; y: number } {
    // Use playerSpawn from map data if available
    if (mapData.playerSpawn) {
      return {
        x: mapData.playerSpawn.x * mapData.tileSize + mapData.tileSize / 2,
        y: mapData.playerSpawn.y * mapData.tileSize + mapData.tileSize / 2
      };
    }
    
    // Fallback: Spawn player in the center of the map
    const centerX = Math.floor(mapData.mapWidth / 2);
    const centerY = Math.floor(mapData.mapHeight / 2);
    
    return {
      x: centerX * mapData.tileSize + mapData.tileSize / 2,
      y: centerY * mapData.tileSize + mapData.tileSize / 2
    };
  }
}
