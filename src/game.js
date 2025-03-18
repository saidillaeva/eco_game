import BankScene from './scenes/BankScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MenuScene, BankScene, GameScene], 
};

const game = new Phaser.Game(config);
