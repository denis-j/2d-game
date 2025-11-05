import Phaser from 'phaser';

export class GameHUD {
  private scene: Phaser.Scene;
  private hpBar!: Phaser.GameObjects.Graphics;
  private hpBarBg!: Phaser.GameObjects.Graphics;
  private hpText!: Phaser.GameObjects.Text;
  private coinText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  private coins: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create(): void {
    // Create HUD elements that stay fixed on screen
    const camera = this.scene.cameras.main;

    // HP Bar background
    this.hpBarBg = this.scene.add.graphics();
    this.hpBarBg.setScrollFactor(0);
    this.hpBarBg.setDepth(100);

    // HP Bar
    this.hpBar = this.scene.add.graphics();
    this.hpBar.setScrollFactor(0);
    this.hpBar.setDepth(101);

    // HP Text
    this.hpText = this.scene.add.text(20, 18, 'HP: 100/100', {
      font: '12px monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.hpText.setScrollFactor(0);
    this.hpText.setDepth(102);

    // Coin counter
    this.coinText = this.scene.add.text(camera.width - 20, 20, 'Coins: 0', {
      font: '14px monospace',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.coinText.setOrigin(1, 0);
    this.coinText.setScrollFactor(0);
    this.coinText.setDepth(102);

    // Level indicator
    this.levelText = this.scene.add.text(camera.width / 2, 20, 'Level 5: Die vergessenen Zellen', {
      font: '14px monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.levelText.setOrigin(0.5, 0);
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(102);
  }

  public updateHP(currentHp: number, maxHp: number): void {
    // Update HP bar
    const barWidth = 150;
    const barHeight = 20;
    const x = 20;
    const y = 20;

    // Background
    this.hpBarBg.clear();
    this.hpBarBg.fillStyle(0x000000, 0.7);
    this.hpBarBg.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);

    // HP bar
    this.hpBar.clear();

    // Color based on HP percentage
    const hpPercentage = currentHp / maxHp;
    let color: number;
    if (hpPercentage > 0.6) {
      color = 0x00ff00; // Green
    } else if (hpPercentage > 0.3) {
      color = 0xffff00; // Yellow
    } else {
      color = 0xff0000; // Red
    }

    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRect(x, y, barWidth * hpPercentage, barHeight);

    // Border
    this.hpBar.lineStyle(2, 0xffffff, 0.8);
    this.hpBar.strokeRect(x, y, barWidth, barHeight);

    // Update text
    this.hpText.setText(`HP: ${Math.max(0, currentHp)}/${maxHp}`);
  }

  public addCoins(amount: number): void {
    this.coins += amount;
    this.updateCoinDisplay();
  }

  public getCoins(): number {
    return this.coins;
  }

  private updateCoinDisplay(): void {
    this.coinText.setText(`Coins: ${this.coins}`);

    // Bounce animation when coins are added
    this.scene.tweens.add({
      targets: this.coinText,
      scale: 1.2,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
  }

  public setLevel(levelNumber: number, levelName: string): void {
    this.levelText.setText(`Level ${levelNumber}: ${levelName}`);
  }

  public showMessage(message: string, duration: number = 2000): void {
    const camera = this.scene.cameras.main;
    const messageText = this.scene.add.text(camera.width / 2, camera.height - 100, message, {
      font: '16px monospace',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
      stroke: '#ffd700',
      strokeThickness: 2
    });
    messageText.setOrigin(0.5);
    messageText.setScrollFactor(0);
    messageText.setDepth(150);
    messageText.setAlpha(0);

    // Fade in
    this.scene.tweens.add({
      targets: messageText,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        // Wait and fade out
        this.scene.time.delayedCall(duration, () => {
          this.scene.tweens.add({
            targets: messageText,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              messageText.destroy();
            }
          });
        });
      }
    });
  }
}
