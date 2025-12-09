// Cena de Menu (MenuScene)
// Onde o jogador escolhe a personagem antes de começar o jogo
export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene'); // Define a chave única para esta cena
    }

    create() {
        // Fundo (Azul Escuro)
        this.add.rectangle(0, 0, 1280, 720, 0x2c3e50).setOrigin(0);

        // Título
        this.add.text(640, 100, 'Biblioteca do Conhecimento', {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Instruções de Seleção de Personagem
        this.add.text(640, 250, 'Escolhe a tua personagem:', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Opções de Personagem
        // Usar sprites para mostrar as personagens disponíveis
        const char1 = this.add.sprite(440, 400, 'char1').setInteractive().setScale(0.5);
        const char2 = this.add.sprite(640, 400, 'char2').setInteractive().setScale(0.5);
        const char3 = this.add.sprite(840, 400, 'char3').setInteractive().setScale(0.5);

        // Etiquetas para as personagens (A, B, C)
        const text1 = this.add.text(440, 500, 'A', { fontSize: '32px' }).setOrigin(0.5);
        const text2 = this.add.text(640, 500, 'B', { fontSize: '32px' }).setOrigin(0.5);
        const text3 = this.add.text(840, 500, 'C', { fontSize: '32px' }).setOrigin(0.5);

        // Lógica de Seleção
        const start = (charKey) => {
            console.log('Personagem selecionada:', charKey);
            // Feedback visual de carregamento
            this.add.text(640, 550, 'A Carregar...', { fontSize: '32px', fill: '#f1c40f' }).setOrigin(0.5);

            // Pequeno atraso para deixar a UI atualizar antes de carregar a cena pesada
            this.time.delayedCall(100, () => {
                try {
                    // Iniciar a GameScene com a personagem escolhida e nível 1
                    this.scene.start('GameScene', { character: charKey, level: 1 });
                } catch (e) {
                    console.error('Erro ao iniciar GameScene:', e);
                    alert('Erro ao iniciar o jogo: ' + e.message);
                }
            });
        };

        // Eventos de clique nas imagens
        char1.on('pointerdown', () => start('char1'));
        char2.on('pointerdown', () => start('char2'));
        char3.on('pointerdown', () => start('char3'));

        // Suporte para teclado (Teclas A, B, C)
        this.input.keyboard.on('keydown-A', () => start('char1'));
        this.input.keyboard.on('keydown-B', () => start('char2'));
        this.input.keyboard.on('keydown-C', () => start('char3'));
    }

    startGame(character) {
        // Lógica movida para a função 'start' acima
    }
}
