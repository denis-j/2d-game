import Phaser from 'phaser';

export class GameHUD {
  private scene: Phaser.Scene;
  private uiCamera!: Phaser.Cameras.Scene2D.Camera;
  private hpBar!: Phaser.GameObjects.Graphics;
  private hpBarBg!: Phaser.GameObjects.Graphics;
  private hpText!: Phaser.GameObjects.Text;
  private coinText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private heartCounter!: Phaser.GameObjects.Sprite;
  private livesText!: Phaser.GameObjects.Text;

  private coins: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createUICamera();
    this.create();
  }

  private createUICamera(): void {
    // Create a separate UI camera that ignores the main camera's zoom/position
    this.uiCamera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);
    this.uiCamera.setScroll(0, 0);
    this.uiCamera.setZoom(1); // No zoom for UI
    
    // Make the main camera ignore UI elements
    this.scene.cameras.main.ignore([]);
    
    console.log('📷 UI Camera created:', {
      width: this.uiCamera.width,
      height: this.uiCamera.height,
      zoom: this.uiCamera.zoom
    });
  }

  private create(): void {
    // Create HUD elements that are only visible to the UI camera
    const hudElements: Phaser.GameObjects.GameObject[] = [];

    // Coin counter - top right
    this.coinText = this.scene.add.text(this.uiCamera.width - 10, 10, 'Coins: 0', {
      font: '20px Arial',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4,
      backgroundColor: '#00000088'
    });
    this.coinText.setOrigin(1, 0);
    this.coinText.setScrollFactor(0, 0);
    hudElements.push(this.coinText);

    // Level indicator - top center
    this.levelText = this.scene.add.text(this.uiCamera.width / 2, 10, 'Level 5: Die vergessenen Zellen', {
      font: '20px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      backgroundColor: '#00000088'
    });
    this.levelText.setOrigin(0.5, 0);
    this.levelText.setScrollFactor(0, 0);
    hudElements.push(this.levelText);

    // Heart counter - large and prominent in top-left
    // This shows both HP and Lives visually
    const heartCounterX = 15;
    const heartCounterY = 15;
    
    // Check if texture exists before creating sprite
    if (!this.scene.textures.exists('heart_counter')) {
      console.error('❌ ERROR: heart_counter texture not found!');
      // Create a visible placeholder rectangle
      const placeholder = this.scene.add.rectangle(heartCounterX, heartCounterY, 120, 60, 0xff0000, 0.8);
      placeholder.setOrigin(0, 0);
      placeholder.setScrollFactor(0, 0);
      hudElements.push(placeholder);
      
      const errorText = this.scene.add.text(heartCounterX + 10, heartCounterY + 20, 'MISSING\nHEART', {
        font: '14px Arial',
        color: '#ffffff'
      });
      errorText.setScrollFactor(0, 0);
      hudElements.push(errorText);
    } else {
      console.log('✅ Creating heart counter sprite...');
      // The spritesheet has 31 frames (0-30) based on 192x992 ÷ 32px height
      // Frame 0 = full hearts (10 lives)
      // Frame 30 = empty hearts (0 lives)
      // Start with frame 0 for full health
      this.heartCounter = this.scene.add.sprite(heartCounterX, heartCounterY, 'heart_counter', 0);
      this.heartCounter.setOrigin(0, 0); // Top-left origin
      this.heartCounter.setScrollFactor(0, 0);
      
      // Scale to achieve target display size of ~208x48px
      // Original frame size: 192 x 32px
      // To get 208px width: 208 / 192 = 1.083
      // To get 48px height: 48 / 32 = 1.5
      // Use 1.1 for a good compromise
      const scale = 1.1;
      this.heartCounter.setScale(scale);
      
      console.log('🔍 Frame display check - should see only ONE heart bar at a time');
      hudElements.push(this.heartCounter);

      console.log('💚 Heart Counter created:', {
        x: this.heartCounter.x,
        y: this.heartCounter.y,
        frameSize: '192 x 32px',
        displaySize: `${this.heartCounter.displayWidth.toFixed(1)} x ${this.heartCounter.displayHeight.toFixed(1)}px`,
        scale: this.heartCounter.scale,
        currentFrame: this.heartCounter.frame.name,
        totalFrames: this.scene.textures.get('heart_counter').frameTotal,
        note: '31 frames total for different health states'
      });
    }

    // Create placeholder graphics for HP bar (needed for updateHP method but invisible)
    this.hpBarBg = this.scene.add.graphics();
    this.hpBarBg.setScrollFactor(0, 0);
    this.hpBarBg.setVisible(false);
    hudElements.push(this.hpBarBg);

    this.hpBar = this.scene.add.graphics();
    this.hpBar.setScrollFactor(0, 0);
    this.hpBar.setVisible(false);
    hudElements.push(this.hpBar);

    // Create placeholder text (for compatibility but hidden)
    this.hpText = this.scene.add.text(0, 0, '', { font: '1px Arial' });
    this.hpText.setScrollFactor(0, 0);
    this.hpText.setVisible(false);
    hudElements.push(this.hpText);

    this.livesText = this.scene.add.text(0, 0, '', { font: '1px Arial' });
    this.livesText.setScrollFactor(0, 0);
    this.livesText.setVisible(false);
    hudElements.push(this.livesText);

    // Make main camera ignore all HUD elements
    this.scene.cameras.main.ignore(hudElements);
    
    // Make UI camera only show HUD elements
    this.uiCamera.ignore(
      this.scene.children.list.filter(child => !hudElements.includes(child))
    );
    
    console.log('✅ HUD created with', hudElements.length, 'elements');
  }

  public updateHP(_currentHp: number, _maxHp: number): void {
    // HP is now shown visually through the heart counter
    // This method is kept for compatibility but does nothing
    // The heart counter frames show the HP state
  }

  public updateLives(currentLives: number): void {
    // Update heart counter sprite frame if it exists
    if (!this.heartCounter) {
      console.warn('⚠️ Heart counter sprite not available');
      return;
    }

    // Frame mapping: 31 frames total (0-30)
    // Frame 0 = full hearts (10 lives)
    // Frame 30 = empty hearts (0 lives)
    // Formula: 30 - (lives * 3)
    const frameIndex = Math.max(0, Math.min(30, 30 - (currentLives * 3)));
    
    this.heartCounter.setFrame(frameIndex);

    console.log('💙 Lives updated:', currentLives, '→ Frame:', frameIndex, '/ 30');

    // Flash effect when taking damage
    if (currentLives >= 0 && currentLives < 10) {
      // Flash effect
      this.scene.tweens.add({
        targets: this.heartCounter,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 2,
        ease: 'Power2',
        onComplete: () => {
          this.heartCounter.setAlpha(1);
        }
      });

      // Shake animation
      const originalX = this.heartCounter.x;
      this.scene.tweens.add({
        targets: this.heartCounter,
        x: originalX + 5,
        duration: 50,
        yoyo: true,
        repeat: 3,
        ease: 'Power2',
        onComplete: () => {
          this.heartCounter.setX(originalX);
        }
      });
    }
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
