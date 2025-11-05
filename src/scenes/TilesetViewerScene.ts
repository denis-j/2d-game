import Phaser from 'phaser';

export class TilesetViewerScene extends Phaser.Scene {
  private returnToScene: string = 'GameScene';

  constructor() {
    super({ key: 'TilesetViewerScene' });
  }

  create(): void {
    // Dark background
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Title
    const title = this.add.text(
      this.cameras.main.centerX,
      20,
      '🎨 DUNGEON TILESET VIEWER',
      {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold'
      }
    );
    title.setOrigin(0.5, 0);

    // Instructions
    const instructions = this.add.text(
      this.cameras.main.centerX,
      50,
      'Press ESC to return | Scroll to navigate',
      {
        fontSize: '14px',
        color: '#aaaaaa',
        fontFamily: 'monospace'
      }
    );
    instructions.setOrigin(0.5, 0);

    // Get tileset texture info
    const texture = this.textures.get('dungeon_tiles');
    const frameNames = texture.getFrameNames();
    const totalTiles = frameNames.length;

    // Calculate grid layout
    const tileSize = 16;
    const scale = 3; // Make tiles bigger for viewing
    const displaySize = tileSize * scale;
    const padding = 10;
    const tilesPerRow = 14; // Dungeon tileset is 14 tiles wide
    const startX = 40;
    const startY = 100;

    // Create scrollable container
    const container = this.add.container(0, 0);

    // Display all tiles
    for (let i = 0; i < totalTiles; i++) {
      const row = Math.floor(i / tilesPerRow);
      const col = i % tilesPerRow;
      
      const x = startX + col * (displaySize + padding);
      const y = startY + row * (displaySize + padding);

      // Background for each tile
      const bg = this.add.rectangle(x, y, displaySize, displaySize, 0x2a2a3e, 0.8);
      bg.setOrigin(0, 0);
      container.add(bg);

      // The tile sprite
      const sprite = this.add.sprite(
        x + displaySize / 2,
        y + displaySize / 2,
        'dungeon_tiles',
        i
      );
      sprite.setScale(scale);
      container.add(sprite);

      // Tile index number (only show for first row)
      if (row === 0) {
        const indexText = this.add.text(
          x + displaySize / 2,
          y - 15,
          `${i}`,
          {
            fontSize: '12px',
            color: '#ffcc00',
            fontFamily: 'monospace',
            fontStyle: 'bold'
          }
        );
        indexText.setOrigin(0.5, 1);
        container.add(indexText);
      }

      // Add hover effect
      bg.setInteractive();
      bg.on('pointerover', () => {
        bg.setFillStyle(0x3a3a5e, 1);
        // Show tile info
        this.showTileInfo(i, x + displaySize / 2, y + displaySize + 5);
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(0x2a2a3e, 0.8);
        this.hideTileInfo();
      });
    }

    // Info text at bottom
    const info = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.height - 30,
      `Total Tiles: ${totalTiles} | Floor: 95-100 | Walls: Various`,
      {
        fontSize: '14px',
        color: '#888888',
        fontFamily: 'monospace'
      }
    );
    info.setOrigin(0.5, 0);
    info.setScrollFactor(0);

    // Camera controls
    this.cameras.main.setBounds(0, 0, 1000, startY + Math.ceil(totalTiles / tilesPerRow) * (displaySize + padding) + 100);
    
    // Scroll with mouse wheel
    this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any, deltaX: number, deltaY: number) => {
      this.cameras.main.scrollY += deltaY * 0.5;
    });

    // ESC key to return
    const escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => {
      this.scene.stop('TilesetViewerScene');
      this.scene.resume(this.returnToScene);
    });

    // Also T key to toggle back
    const tKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    tKey.on('down', () => {
      this.scene.stop('TilesetViewerScene');
      this.scene.resume(this.returnToScene);
    });
  }

  private tileInfoText?: Phaser.GameObjects.Text;

  private showTileInfo(index: number, x: number, y: number): void {
    if (this.tileInfoText) {
      this.tileInfoText.destroy();
    }

    this.tileInfoText = this.add.text(
      x,
      y,
      `Tile ${index}`,
      {
        fontSize: '10px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 4, y: 2 },
        fontFamily: 'monospace'
      }
    );
    this.tileInfoText.setOrigin(0.5, 0);
  }

  private hideTileInfo(): void {
    if (this.tileInfoText) {
      this.tileInfoText.destroy();
      this.tileInfoText = undefined;
    }
  }
}

