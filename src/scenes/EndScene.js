export class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    init(data) {
        this.score = data.score || 0;
        this.win = data.win || false;
    }

    create() {
        const titleText = this.win ? 'Parabéns! Completaste a Biblioteca!' : 'Game Over';
        const color = this.win ? '#2ecc71' : '#e74c3c';

        this.add.text(640, 200, titleText, {
            fontSize: '48px',
            fill: color
        }).setOrigin(0.5);

        this.add.text(640, 300, `Pontuação Final: ${this.score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Save High Score
        this.saveHighScore(this.score);

        // Restart Button
        const restartBtn = this.add.text(640, 500, 'Jogar Novamente', {
            fontSize: '32px',
            fill: '#3498db'
        }).setOrigin(0.5).setInteractive();

        restartBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    saveHighScore(score) {
        const currentHigh = localStorage.getItem('biblioteca_highscore') || 0;
        if (score > currentHigh) {
            localStorage.setItem('biblioteca_highscore', score);
            this.add.text(640, 400, 'Novo Recorde!', { fontSize: '24px', fill: '#f1c40f' }).setOrigin(0.5);
        } else {
            this.add.text(640, 400, `Recorde Atual: ${currentHigh}`, { fontSize: '24px', fill: '#95a5a6' }).setOrigin(0.5);
        }
    }
}
