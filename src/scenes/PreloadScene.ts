import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '20px monospace',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);

    // Loading progress
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    // Load all game assets
    this.loadCharacterAssets();
    this.loadTilesetAssets();
    this.loadObjectAssets();
  }

  private loadCharacterAssets(): void {
    // Knight (Player)
    this.load.spritesheet('knight_idle', 'assets/dungeon-tileset-asset-pack/1x/Characters/Knight_idle.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('knight_walk', 'assets/dungeon-tileset-asset-pack/1x/Characters/Knight_walk.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    // Enemies
    this.load.spritesheet('slime_green', 'assets/dungeon-tileset-asset-pack/1x/Characters/Slime (green).png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('slime_blue', 'assets/dungeon-tileset-asset-pack/1x/Characters/Slime (blue).png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('slime_red', 'assets/dungeon-tileset-asset-pack/1x/Characters/Slime (red).png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('skeleton_idle', 'assets/dungeon-tileset-asset-pack/1x/Characters/Skeleton_idle.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('skeleton_walk', 'assets/dungeon-tileset-asset-pack/1x/Characters/Skeleton_walk.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('bat', 'assets/dungeon-tileset-asset-pack/1x/Characters/Bat.png', {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  private loadTilesetAssets(): void {
    this.load.image('dungeon_tiles', 'assets/dungeon-tileset-asset-pack/1x/Dungeon Tileset.png');
  }

  private loadObjectAssets(): void {
    // Coins
    this.load.image('bronze_coin', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Bronze coin.png');
    this.load.image('silver_coin', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Silver coin.png');
    this.load.image('gold_coin', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Gold coin.png');

    // Keys
    this.load.image('bronze_key', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Bronze key.png');
    this.load.image('silver_key', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Silver key.png');
    this.load.image('gold_key', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Gold key.png');

    // Potions
    this.load.image('red_potion', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Red potion.png');
    this.load.image('green_potion', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Green potion.png');
    this.load.image('blue_potion', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Blue potion.png');

    // Chests
    this.load.image('small_chest', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Small chest.png');
    this.load.image('large_chest', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Large chest.png');
    this.load.image('mimic_chest', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Mimic chest.png');

    // Traps
    this.load.spritesheet('arrow_trap', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Arrow trap.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image('arrow_projectile', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Arrow trap (projectile).png');
    this.load.spritesheet('fire_trap', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Fire trap.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('poison_trap', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Poison trap.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet('spikes_trap', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Spikes trap.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    // Doors and objects
    this.load.image('door_front', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Door (front).png');
    this.load.image('door_side', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Door (side).png');
    this.load.spritesheet('lever', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Lever.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image('torch_front', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Torch (front).png');
    this.load.image('torch_side', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Torch (side).png');
    this.load.image('sword', 'assets/dungeon-tileset-asset-pack/1x/Objects and traps/Sword.png');
  }

  create(): void {
    // Start the main game scene
    this.scene.start('GameScene');
  }
}
