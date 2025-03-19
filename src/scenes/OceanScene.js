export default class OceanScene extends Phaser.Scene {
    constructor() {
        super({ key: "OceanScene" });
        this.score = 0;
    }

    preload() {
        // Загружаем изображения
        this.load.image("ocean_bg", "assets/images/ocean.png");
        this.load.image("boatt", "assets/images/boat.png");
        this.load.image("hook", "assets/images/hook.png"); // Крюк
        this.load.image("rope", "assets/images/rope.png"); // Веревка
        this.load.image("plastic", "assets/images/rubbish_paper.png");
        this.load.image("trash", "assets/images/trash_bag.png");
    }

    create() {
        // Фон
        this.add.image(400, 300, "ocean_bg").setScale(1.1);

        // Лодка
        this.player = this.physics.add.sprite(400, 500, "boat").setCollideWorldBounds(true);

        // Верёвка (изначально невидима)
        this.rope = this.add.sprite(this.player.x, this.player.y + 30, "rope").setOrigin(0.5, 0);
        this.rope.setScale(1, 0.1);
        this.rope.setAlpha(0);

        // Крюк
        this.hook = this.add.sprite(this.player.x, this.player.y + 30, "hook").setOrigin(0.5, 0);
        this.hook.setScale(0.5);
        this.hook.setAlpha(0); // Крюк невидимый в начале

        // Группа мусора
        this.trashGroup = this.physics.add.group();

        // Управление
        this.cursors = this.input.keyboard.createCursorKeys();

        // Таймер появления мусора
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnTrash,
            callbackScope: this,
            loop: true
        });

        // Запускаем крюк при нажатии на пробел
        this.input.keyboard.on("keydown-SPACE", () => this.useHook());

        // Текст очков
        this.scoreText = this.add.text(20, 20, "Очки: 0", { fontSize: "24px", fill: "#fff" });
    }

    update() {
        // Двигаем лодку
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }

        // Веревка и крюк всегда следуют за лодкой, если не активны
        if (this.hook.alpha === 0) {
            this.rope.x = this.player.x;
            this.hook.x = this.player.x;
        }
    }

    // Анимация крюка с верёвкой (вытягивание и возврат)
    useHook() {
        if (this.hook.alpha === 1) return; // Если крюк уже вытягивается, пропускаем

        this.hook.setAlpha(1);
        this.rope.setAlpha(1);
        this.rope.setScale(1, 0.1);

        // Вытягиваем веревку вниз
        this.tweens.add({
            targets: [this.rope, this.hook],
            scaleY: 1, // Удлиняем вниз
            duration: 500,
            ease: "Power2",
            onComplete: () => {
                this.checkForTrash(); // Проверяем, зацепил ли крюк мусор

                // Возвращаем крюк обратно
                this.tweens.add({
                    targets: [this.rope, this.hook],
                    scaleY: 0.1,
                    duration: 300,
                    ease: "Power2",
                    onComplete: () => {
                        this.hook.setAlpha(0);
                        this.rope.setAlpha(0);
                    }
                });
            }
        });
    }

    // Проверяем, зацепил ли крюк мусор
    checkForTrash() {
        this.trashGroup.children.iterate((trash) => {
            if (Phaser.Math.Distance.Between(this.hook.x, this.hook.y + this.hook.height, trash.x, trash.y) < 50) {
                trash.destroy(); // Убираем мусор
                this.score += 10;
                this.scoreText.setText(`Очки: ${this.score}`);
            }
        });
    }

    // Создаём мусор
    spawnTrash() {
        let x = Phaser.Math.Between(50, 750);
        let trashType = Phaser.Math.RND.pick(["plastic", "trash"]);
        
        let trash = this.trashGroup.create(x, Phaser.Math.Between(50, 300), trashType);
        trash.setScale(0.3); // Уменьшает размер мусора
        trash.setOrigin(0.5, 0.5); // Центрирует точку опоры
        trash.setVelocityY(50);
    }
    
}

