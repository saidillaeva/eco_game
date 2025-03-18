export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('menu_bg', 'assets/images/menu_bg.png');
        this.load.image('play_button', 'assets/images/play_button.png');
        this.load.image('exit_button', 'assets/images/exit_button.png');
    }

    create() {
        this.add.image(400, 300, 'menu_bg');

        let playButton = this.add.image(400, 250, 'play_button').setInteractive();
        let exitButton = this.add.image(400, 350, 'exit_button').setInteractive();

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        exitButton.on('pointerdown', () => {
            window.close();
        });
    }
}
