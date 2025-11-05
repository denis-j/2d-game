import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Dark overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    overlay.setScrollFactor(0);

    // Game Over text
    const gameOverText = this.add.text(width / 2, height / 2 - 100, 'GAME OVER', {
      font: 'bold 64px monospace',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 8
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setScrollFactor(0);

    // Fade in animation
    gameOverText.setAlpha(0);
    this.tweens.add({
      targets: gameOverText,
      alpha: 1,
      duration: 1000,
      ease: 'Power2'
    });

    // Subtitle
    const subtitleText = this.add.text(width / 2, height / 2, 'Du bist im Dungeon gestorben', {
      font: '24px monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    subtitleText.setOrigin(0.5);
    subtitleText.setScrollFactor(0);
    subtitleText.setAlpha(0);

    this.tweens.add({
      targets: subtitleText,
      alpha: 1,
      duration: 1000,
      delay: 500,
      ease: 'Power2'
    });

    // Retry button
    const retryText = this.add.text(width / 2, height / 2 + 80, 'LEERTASTE zum Neustart', {
      font: '20px monospace',
      color: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3
    });
    retryText.setOrigin(0.5);
    retryText.setScrollFactor(0);
    retryText.setAlpha(0);

    this.tweens.add({
      targets: retryText,
      alpha: 1,
      duration: 1000,
      delay: 1000,
      ease: 'Power2'
    });

    // Pulse animation for retry text
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: retryText,
        scale: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });

    // Listen for space key to restart
    const spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.on('down', () => {
      this.scene.start('GameScene');
    });
  }
}
