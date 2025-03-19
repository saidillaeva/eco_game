export default class BankScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BankScene' });
        this.score = 0;
        this.timeLeft = 10; 
        this.trashItems = []; 
        this.gameEnded = false; 
    }

    preload() {
        this.load.image('bank_bg', 'assets/images/bank_bg.png');
        this.load.image('paper', 'assets/images/paper.png');
        this.load.image('plastic', 'assets/images/plastic.png');
        this.load.image('glass', 'assets/images/glass.png');
        this.load.image('bag', 'assets/images/bag.png');
        this.load.image('bin', 'assets/images/bin.png');
        this.load.image('back_button', 'assets/images/back_button.png');

        // 🔊 Загрузка звуков
        this.load.audio('bg_music', 'assets/sounds/banksound.mp3'); 
        this.load.audio('game_over_sound', 'assets/sounds/winsoound.mp3'); 
    }

    create() {
        console.log("🚀 BankScene загружена!");

     
        this.add.image(400, 300, 'bank_bg').setScale(1.3);

       
        this.bin = this.add.image(400, 580, 'bin').setScale(0.9).setDepth(0);

  
        this.taskText = this.add.text(200, 50, "", {
            fontSize: '28px',
            fill: '#FFD700',
            fontFamily: 'Comic Sans MS',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        });

        
        this.scoreText = this.add.text(20, 20, "Очки: 0", { fontSize: '20px', fill: '#fff' });

      
        this.timerText = this.add.text(650, 20, `Время: ${this.timeLeft}`, { fontSize: '20px', fill: '#fff' });

       
        this.timeEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

       
        this.startNewRound();

      
        let backButton = this.add.image(700, 50, 'back_button').setInteractive();
        backButton.setScale(0.7);
        backButton.on('pointerover', () => backButton.setScale(0.8));
        backButton.on('pointerout', () => backButton.setScale(0.7));
        backButton.on('pointerdown', () => {
            window.location.href = "game.html";
        });

        this.setupDragAndDrop();

       
        this.bgMusic = this.sound.add('bg_music', { loop: true, volume: 0.3 });
        this.bgMusic.play();

     
        this.gameOverSound = this.sound.add('game_over_sound', { volume: 1.0 });
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.timerText.setText(`Время: ${this.timeLeft}`);
        } else {
            if (!this.gameEnded) {
                this.endGame();
                this.gameEnded = true;
            }
        }
    }

    startNewRound() {
        if (this.gameEnded) return;

        console.log("🚀 Запускаем новый раунд!");

     
        this.trashItems.forEach(trash => trash.destroy());
        this.trashItems = [];

        
        this.trashTypes = ['paper', 'plastic', 'glass', 'bag'];
        this.requestedTrash = Phaser.Utils.Array.Shuffle(this.trashTypes).slice(0, 2);
        this.taskText.setText(`Банк мусора ждёт: ${this.requestedTrash.join(' + ')}`);

 
        let positions = [180, 320, 460, 600];
        let trashY1 = 320;
        let trashY2 = 320;

        this.trashTypes.forEach((type, index) => {
            let yPos = index % 2 === 0 ? trashY1 : trashY2;
            let trash = this.add.image(positions[index], yPos, type).setInteractive();
            trash.setData('type', type);
            trash.setScale(0.18).setDepth(1);
            this.input.setDraggable(trash);
            this.trashItems.push(trash);
        });

        console.log("✅ Новый раунд загружен:", this.requestedTrash);
    }

    setupDragAndDrop() {
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (this.checkCorrectDrop(gameObject)) {
                let type = gameObject.getData('type');
                console.log(`✅ ${type} доставлен в банк!`);

                this.score += 10;
                this.scoreText.setText(`Очки: ${this.score}`);

                gameObject.destroy();
                this.trashItems = this.trashItems.filter(item => item !== gameObject);

                if (this.trashItems.length === 0) {
                    console.log("🔄 Все предметы собраны! Создаём новый мусор.");
                    this.time.delayedCall(500, () => this.startNewRound(), [], this);
                }
            } else {
                console.log("❌ Ошибка! Мусор не принят.");
                this.score -= 5;
                this.scoreText.setText(`Очки: ${this.score}`);

                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.input.dragStartX,
                    y: gameObject.input.dragStartY,
                    duration: 300,
                    ease: 'Power2'
                });
            }
        });
    }

    checkCorrectDrop(gameObject) {
        let distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, this.bin.x, this.bin.y);
        return distance < 80 && this.requestedTrash.includes(gameObject.getData('type'));
    }

    endGame() {
        if (this.gameEnded) return;

        this.gameEnded = true;
        this.timeEvent.remove(false);
        this.bgMusic.stop(); 

        if (!this.gameOverSoundPlayed) { 
            this.gameOverSound.play();
            this.gameOverSoundPlayed = true;
        }

        let overlay = this.add.rectangle(400, 300, 500, 300, 0x000000, 0.8).setDepth(2);
        this.add.text(190, 240, `⏳ Время вышло!`, { fontSize: '32px', fill: '#FFD700', fontFamily: 'Comic Sans MS' }).setDepth(3);
        this.add.text(190, 280, `🎯 Ваш результат: ${this.score} очков`, { fontSize: '28px', fill: '#fff', fontFamily: 'Comic Sans MS' }).setDepth(3);

        let restartButton = this.add.text(190, 330, "🔄 Начать заново", { 
            fontSize: '24px', fill: '#FFF', backgroundColor: '#ff6b6b', 
            padding: { x: 20, y: 10 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.restartGame();
        }).setDepth(3);
    }

    restartGame() {
        this.gameEnded = false;
        this.timeLeft = 10;
        this.scene.restart();
    }
}
