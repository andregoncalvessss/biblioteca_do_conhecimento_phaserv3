// Cena de Quiz (QuizScene)
// Apresenta uma pergunta ao jogador e verifica a resposta
export class QuizScene extends Phaser.Scene {
    constructor() {
        super('QuizScene'); // Define a chave única para esta cena
    }

    // Recebe os dados passados pela GameScene
    init(data) {
        this.questionData = data.question; // O objeto da pergunta (texto, respostas, correta)
        this.onComplete = data.onComplete; // Função callback para executar ao fechar o quiz
    }

    create() {
        // Fundo semi-transparente para focar na pergunta
        this.add.rectangle(640, 360, 800, 600, 0x000000, 0.8);

        // Texto da Pergunta
        this.add.text(640, 200, this.questionData.question, {
            fontSize: '32px',
            fill: '#ffffff',
            wordWrap: { width: 700 } // Quebra de linha automática
        }).setOrigin(0.5);

        // Respostas
        const startY = 300; // Posição Y inicial para a primeira resposta
        this.questionData.answers.forEach((answer, index) => {
            const y = startY + (index * 80); // Espaçamento vertical entre respostas

            // Fundo do botão de resposta
            const bg = this.add.rectangle(640, y, 600, 60, 0x34495e).setInteractive();
            // Texto da resposta
            const text = this.add.text(640, y, answer, { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

            // Evento de clique
            bg.on('pointerdown', () => {
                this.checkAnswer(index, bg);
            });

            // Efeito Hover (mudar cor ao passar o rato)
            bg.on('pointerover', () => bg.setFillStyle(0x2c3e50));
            bg.on('pointerout', () => bg.setFillStyle(0x34495e));
        });
    }

    // Verifica se a resposta selecionada está correta
    checkAnswer(index, button) {
        const isCorrect = index === this.questionData.correct;

        if (isCorrect) {
            button.setFillStyle(0x2ecc71); // Verde para correto
            this.add.text(640, 600, 'Correto!', { fontSize: '40px', fill: '#2ecc71' }).setOrigin(0.5);
            if (this.cache.audio.exists('correct')) {
                this.sound.play('correct'); // Tocar som "plim"
            }
        } else {
            button.setFillStyle(0xe74c3c); // Vermelho para errado
            this.add.text(640, 600, 'Errado!', { fontSize: '40px', fill: '#e74c3c' }).setOrigin(0.5);
        }

        // Aguardar um pouco para o jogador ver o resultado e fechar
        this.time.delayedCall(1000, () => {
            this.scene.stop(); // Parar esta cena (overlay)
            if (this.onComplete) this.onComplete(isCorrect); // Notificar a GameScene do resultado
        });
    }
}
