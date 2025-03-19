export default class OceanScene extends Phaser.Scene {
    constructor() {
        super({ key: "OceanScene" });
        this.score = 0;
        this.timeLeft = 30;
        this.gameOver = false;
    }

    preload() {
        this.load.image("ocean_bg", "assets/images/ocean.png");
        this.load.image("boat", "assets/images/boat.png");
        this.load.image("plastic", "assets/images/rubbish_paper.png");
        this.load.image("trash", "assets/images/trash_bag.png");
    }

    create() {
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;

        // Фон
        this.bg = this.add.image(0, 0, "ocean_bg").setOrigin(0).setDisplaySize(this.gameWidth, this.gameHeight);

        // Лодка
        this.player = this.physics.add.sprite(this.gameWidth / 2, this.gameHeight - 100, "boat").setScale(0.03);
        this.player.setCollideWorldBounds(true);

        // Группа мусора
        this.trashGroup = this.physics.add.group();

        // Управление лодкой (движение за курсором)
        this.input.on("pointermove", (pointer) => {
            if (!this.gameOver) {
                this.player.x = pointer.x;
            }
        });

        // Таймер появления мусора
        this.trashTimer = this.time.addEvent({
            delay: 200,
            callback: this.spawnTrash,
            callbackScope: this,
            loop: true
        });

        // Столкновение мусора и лодки
        this.physics.add.overlap(this.player, this.trashGroup, this.collectTrash, null, this);

        // Таймер игры
        this.timerText = this.add.text(20, 50, `Время: ${this.timeLeft}`, { fontSize: "24px", fill: "#fff" });
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Текст очков
        this.scoreText = this.add.text(20, 20, "Очки: 0", { fontSize: "24px", fill: "#fff" });

        // **Кнопка выхода из игры**
        this.exitButton = this.add.text(this.gameWidth - 150, 20, "❌ Выйти", {
            fontSize: "20px",
            fill: "#fff",
            backgroundColor: "#ff4444",
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on("pointerdown", () => {
            window.location.href = "game.html"; // Переносит на главную страницу
        });
    }

    update() {
        if (this.gameOver) return;

        // Проверяем, пропустил ли игрок мусор
        this.trashGroup.children.each((trash) => {
            if (trash.y > this.gameHeight + 50) {
                this.missTrash(trash);
            }
        });
    }

    collectTrash(player, trash) {
        trash.destroy();
        this.score += 10;
        this.scoreText.setText(`Очки: ${this.score}`);
    }

    spawnTrash() {
        if (this.gameOver) return;

        let x = Phaser.Math.Between(50, this.gameWidth - 50);
        let trashType = Phaser.Math.RND.pick(["plastic", "trash"]);

        let trash = this.trashGroup.create(x, 50, trashType);
        trash.setScale(0.09);
        trash.setVelocityY(100);
    }

    missTrash(trash) {
        if (trash.active) {
            trash.destroy();
            this.score -= 5;
            this.scoreText.setText(`Очки: ${this.score}`);
        }
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.timerText.setText(`Время: ${this.timeLeft}`);
        } else {
            this.endGame();
        }
    }

    endGame() {
        this.gameOver = true;
        this.physics.pause();
        this.trashTimer.remove();

        let overlay = this.add.rectangle(this.gameWidth / 2, this.gameHeight / 2, 400, 200, 0x000000, 0.8);
        overlay.setDepth(1);

        let gameOverText = this.add.text(this.gameWidth / 2 - 80, this.gameHeight / 2 - 40, "Время вышло!", { fontSize: "28px", fill: "#fff" });
        gameOverText.setDepth(2);

        let finalScoreText = this.add.text(this.gameWidth / 2 - 80, this.gameHeight / 2, `Очки: ${this.score}`, { fontSize: "24px", fill: "#fff" });
        finalScoreText.setDepth(2);

        let restartButton = this.add.text(this.gameWidth / 2 - 60, this.gameHeight / 2 + 40, "🔄 Начать заново", {
            fontSize: "20px",
            fill: "#fff",
            backgroundColor: "#44aa44",
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .setDepth(2)
        .on("pointerdown", () => {
            this.restartGame();
        });
    }

    restartGame() {
        this.scene.restart();
        this.gameOver = false;
        this.score = 0;
        this.timeLeft = 30;
    }
}
