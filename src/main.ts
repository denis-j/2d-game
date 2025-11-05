import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.NONE,
    width: window.innerWidth,
    height: window.innerHeight
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [BootScene, PreloadScene, GameScene, GameOverScene],
  backgroundColor: '#000000'
};

const game = new Phaser.Game(config);

// Handle window resize to keep fullscreen
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

console.log('Knight\'s Descent: Escape from the Depths - Starting...');
