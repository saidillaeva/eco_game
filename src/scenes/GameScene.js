export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
    
        this.load.image('game_bg', 'assets/images/game_bg.png'); 
        this.load.image('back_button', 'assets/images/back_button.png'); 

    
        this.load.audio('game_music', 'assets/sounds/mainback.mp3');
    }

    create() {
      
        this.add.image(400, 300, 'game_bg').setScale(1.1);

       
        this.gameMusic = this.sound.add('game_music', { loop: true, volume: 0.5 });
        this.gameMusic.play();
        
      


        
        this.add.text(200, 100, "Выберите мини-игру", {
            fontSize: '32px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        });

        
        let gameButton = this.add.text(300, 250, '🎮 Перейти к играм', {
            fontSize: '26px',
            fill: '#FFF',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 },
            borderRadius: 10
        }).setInteractive();

        gameButton.on('pointerover', () => {
            gameButton.setStyle({ fill: '#FFC107' });
        });
        gameButton.on('pointerout', () => {
            gameButton.setStyle({ fill: '#FFF' });
        });

        gameButton.on('pointerdown', () => {
            this.gameMusic.stop(); 
            window.location.href = "game.html";
        });

        // Кнопка "Назад в меню"
        let backButton = this.add.image(400, 400, 'back_button').setInteractive();

        backButton.on('pointerover', () => {
            backButton.setScale(1.1);
        });
        backButton.on('pointerout', () => {
            backButton.setScale(1);
        });

        backButton.on('pointerdown', () => {
            this.gameMusic.stop(); 
            this.scene.start('MenuScene');
        });
    }
}
