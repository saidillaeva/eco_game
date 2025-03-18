export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('game_bg', 'assets/images/game_bg.png');
    }

    create() {
        this.add.image(400, 300, 'game_bg');
        this.add.text(20, 20, "Добро пожаловать в экологическую игру!", { fontSize: '24px', fill: '#fff' });
    }
}
