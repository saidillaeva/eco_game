export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {

        this.load.image('menu_bg', 'assets/images/menu_bg.jpg'); 
        this.load.image('play_button', 'assets/images/play_button.png');
        this.load.image('exit_button', 'assets/images/exit_button.png'); 

       
        this.load.audio("menu_music", "assets/sounds/mainback.mp3");
    }

    create() {
      
        this.add.image(400, 300, 'menu_bg').setScale(1.1);

       
        this.menuMusic = this.sound.add('menu_music', { loop: true, volume: 0.3 });
        this.menuMusic.play();

        
        let playButton = this.add.image(400, 250, 'play_button').setInteractive();
        let exitButton = this.add.image(400, 350, 'exit_button').setInteractive();

     
        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
        });
        playButton.on('pointerout', () => {
            playButton.setScale(1);
        });

       
        playButton.on('pointerdown', () => {
            this.menuMusic.stop(); 
            this.scene.start('GameScene'); 
        });

        
        exitButton.on('pointerdown', () => {
            this.menuMusic.stop(); 
            window.close(); 
        });
        exitButton.on('pointerover', () => {
            exitButton.setScale(1.1);
        });
        exitButton.on('pointerout', () => {
            exitButton.setScale(1);
        });
    }
}
