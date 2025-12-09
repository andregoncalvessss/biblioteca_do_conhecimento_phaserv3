// Cena de Fim de Jogo (EndScene)
// Mostra o resultado final, pontuação e permite reiniciar
export class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene'); // Define a chave única para esta cena
    }

    // Recebe a pontuação final e o estado de vitória
    init(data) {
        this.score = data.score || 0;
        this.win = data.win || false;
    }

    create() {
        // Definir texto e cor com base na vitória ou derrota
        const titleText = this.win ? 'Parabéns! Completaste a Biblioteca!' : 'Game Over';
        const color = this.win ? '#2ecc71' : '#e74c3c'; // Verde ou Vermelho

        // Mostrar Título
        this.add.text(640, 200, titleText, {
            fontSize: '48px',
            fill: color
        }).setOrigin(0.5);

        // Mostrar Pontuação Final
        this.add.text(640, 300, `Pontuação Final: ${this.score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Guardar e Mostrar Recorde (High Score)
        this.saveHighScore(this.score);

        // Botão de Reiniciar
        const restartBtn = this.add.text(640, 500, 'Jogar Novamente', {
            fontSize: '32px',
            fill: '#3498db'
        }).setOrigin(0.5).setInteractive();

        // Reiniciar o jogo voltando ao Menu
        restartBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    // Lógica para guardar a pontuação máxima no navegador
    saveHighScore(score) {
        const currentHigh = localStorage.getItem('biblioteca_highscore') || 0;

        if (score > currentHigh) {
            // Se a pontuação atual for maior, atualizar o recorde
            localStorage.setItem('biblioteca_highscore', score);
            this.add.text(640, 400, 'Novo Recorde!', { fontSize: '24px', fill: '#f1c40f' }).setOrigin(0.5);
        } else {
            // Caso contrário, mostrar o recorde existente
            this.add.text(640, 400, `Recorde Atual: ${currentHigh}`, { fontSize: '24px', fill: '#95a5a6' }).setOrigin(0.5);
        }
    }
}
