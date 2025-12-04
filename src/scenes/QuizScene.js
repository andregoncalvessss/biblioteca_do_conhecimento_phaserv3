export class QuizScene extends Phaser.Scene {
    constructor() {
        super('QuizScene');
    }

    init(data) {
        this.questionData = data.question;
        this.onComplete = data.onComplete;
    }

    create() {
        // Semi-transparent background
        this.add.rectangle(640, 360, 800, 600, 0x000000, 0.8);

        // Question Text
        this.add.text(640, 200, this.questionData.question, {
            fontSize: '32px',
            fill: '#ffffff',
            wordWrap: { width: 700 }
        }).setOrigin(0.5);

        // Answers
        const startY = 300;
        this.questionData.answers.forEach((answer, index) => {
            const y = startY + (index * 80);
            const bg = this.add.rectangle(640, y, 600, 60, 0x34495e).setInteractive();
            const text = this.add.text(640, y, answer, { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

            bg.on('pointerdown', () => {
                this.checkAnswer(index, bg);
            });

            // Hover effect
            bg.on('pointerover', () => bg.setFillStyle(0x2c3e50));
            bg.on('pointerout', () => bg.setFillStyle(0x34495e));
        });
    }

    checkAnswer(index, button) {
        const isCorrect = index === this.questionData.correct;

        if (isCorrect) {
            button.setFillStyle(0x2ecc71); // Green
            this.add.text(640, 600, 'Correto!', { fontSize: '40px', fill: '#2ecc71' }).setOrigin(0.5);
        } else {
            button.setFillStyle(0xe74c3c); // Red
            this.add.text(640, 600, 'Errado!', { fontSize: '40px', fill: '#e74c3c' }).setOrigin(0.5);
        }

        // Wait and close
        this.time.delayedCall(1000, () => {
            this.scene.stop();
            if (this.onComplete) this.onComplete(isCorrect);
        });
    }
}
