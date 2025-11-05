import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Load loading screen assets if any
    this.load.setBaseURL('.');
  }

  create(): void {
    // Start the preload scene
    this.scene.start('PreloadScene');
  }
}
