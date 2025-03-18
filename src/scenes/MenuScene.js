export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Загружаем фон и кнопки
        this.load.image('menu_bg', 'assets/images/menu_bg.jpg'); // Фон
        this.load.image('play_button', 'assets/images/play_button.png'); // Кнопка "Играть"
        this.load.image('exit_button', 'assets/images/exit_button.png'); // Кнопка "Выход"
    }

    create() {
        // Добавляем фон
        this.add.image(400, 300, 'menu_bg').setScale(1.1);

        // Создаем кнопку "Играть"
        let playButton = this.add.image(400, 250, 'play_button').setInteractive();
        let exitButton = this.add.image(400, 350, 'exit_button').setInteractive();

        // Анимация кнопки при наведении
        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
        });
        playButton.on('pointerout', () => {
            playButton.setScale(1);
        });

        // Клик по кнопке "Играть"
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene'); // Переход в игровую сцену
        });

        // Клик по кнопке "Выход"
        exitButton.on('pointerdown', () => {
            window.close(); // Закрытие игры
        });

        // Анимация кнопки "Выход"
        exitButton.on('pointerover', () => {
            exitButton.setScale(1.1);
        });
        exitButton.on('pointerout', () => {
            exitButton.setScale(1);
        });
    }
}
