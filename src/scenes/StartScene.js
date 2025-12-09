// Cena Inicial (StartScene)
// O ecrã de título do jogo com opções para jogar ou ver instruções
export class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene'); // Define a chave única para esta cena
    }

    create() {
        // 1. Fundo - Azul/Roxo Mágico Escuro
        // Cria um retângulo que cobre todo o ecrã
        this.add.rectangle(0, 0, 1280, 720, 0x1a0b2e).setOrigin(0);

        // 2. Partículas - Pó Mágico
        // Usa a textura 'shine' carregada na BootScene
        // Sintaxe Phaser 3.60+: this.add.particles(x, y, texture, config)
        this.add.particles(0, 0, 'shine', {
            x: { min: 0, max: 1280 }, // Espalhar horizontalmente por todo o ecrã
            y: { min: 0, max: 720 }, // Espalhar verticalmente por todo o ecrã
            lifespan: { min: 2000, max: 5000 }, // Tempo de vida das partículas (2 a 5 segundos)
            speedY: { min: -10, max: -30 }, // Flutuar suavemente para cima
            scale: { start: 0.02, end: 0 }, // Começar pequeno e desaparecer
            quantity: 2, // Quantidade de partículas geradas por ciclo
            blendMode: 'ADD', // Modo de mistura para efeito brilhante
            tint: [0xf1c40f, 0xffffff, 0x3498db] // Cores: Ouro, Branco, Azul
        });

        // 3. Título - Tipografia Elegante
        this.add.text(640, 180, 'Biblioteca do Conhecimento', {
            fontSize: '72px',
            fill: '#f1c40f', // Ouro
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'bold',
            stroke: '#000000', // Contorno preto
            strokeThickness: 6,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 10, stroke: true, fill: true } // Sombra para destaque
        }).setOrigin(0.5);

        // Subtítulo
        this.add.text(640, 250, 'Aventura do Saber', {
            fontSize: '32px',
            fill: '#bdc3c7', // Prata/Cinzento
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'italic'
        }).setOrigin(0.5);


        // 4. Botões
        // Criar botão JOGAR que inicia a MenuScene
        this.createButton(640, 400, 'JOGAR', () => this.scene.start('MenuScene'), 0x27ae60);
        // Criar botão INSTRUÇÕES que abre o modal de ajuda
        this.createButton(640, 520, 'INSTRUÇÕES', () => this.showInstructions(), 0x2980b9);

        // Grupo para os elementos das instruções (para fácil remoção)
        this.instructionsGroup = this.add.group();
    }

    // Função auxiliar para criar botões estilizados
    createButton(x, y, text, callback, color) {
        const btnWidth = 320;
        const btnHeight = 70;

        // Contentor do Botão (agrupa fundo e texto)
        const container = this.add.container(x, y);

        // Fundo do Botão
        const bg = this.add.rectangle(0, 0, btnWidth, btnHeight, color)
            .setStrokeStyle(3, 0xf1c40f) // Borda dourada
            .setInteractive({ useHandCursor: true }); // Tornar interativo com cursor de mão

        // Texto do Botão
        const label = this.add.text(0, 0, text, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        container.add([bg, label]);

        // Interações (Hover e Clique)
        bg.on('pointerover', () => {
            // Animação de escala ao passar o rato
            this.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
            bg.setFillStyle(0xffffff); // Piscar branco
            label.setColor(color === 0x27ae60 ? '#27ae60' : '#2980b9'); // Texto assume a cor do botão
        });

        bg.on('pointerout', () => {
            // Voltar ao tamanho original
            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            bg.setFillStyle(color); // Restaurar cor original
            label.setColor('#ffffff'); // Restaurar cor do texto
        });

        // Executar a função de callback ao clicar
        bg.on('pointerdown', callback);
    }

    // Mostrar o modal de instruções
    showInstructions() {
        // Fundo do Overlay (Escuro para focar a atenção)
        const bg = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.85)
            .setInteractive(); // Bloquear cliques nos elementos de trás

        // Janela Modal (Estilo Livro Antigo)
        const modal = this.add.rectangle(640, 360, 900, 550, 0xfdf5e6) // Cor de papel velho
            .setStrokeStyle(8, 0x8e44ad); // Borda Roxa/Mágica

        // Título das Instruções
        const title = this.add.text(640, 160, 'Livro de Instruções', {
            fontSize: '48px',
            fill: '#2c3e50',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            stroke: '#f1c40f',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Texto das Regras
        const text = this.add.text(640, 340,
            "1. Move-te com as setas do teclado.\n\n" +
            "2. Explora a biblioteca e encontra os livros a brilhar.\n\n" +
            "3. Aproxima-te e usa [ESPAÇO] para interagir.\n\n" +
            "4. Responde às perguntas no menor tempo possível.\n\n" +
            "5. Aproveita o tempo para obteres uma melhor pontuação!", {
            fontSize: '26px',
            fill: '#34495e',
            fontFamily: 'Georgia, serif',
            align: 'center',
            lineSpacing: 10,
            wordWrap: { width: 800 }
        }).setOrigin(0.5);

        // Botão Fechar
        const closeBtn = this.add.rectangle(640, 560, 200, 50, 0xc0392b)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0xffffff);

        const closeText = this.add.text(640, 560, 'FECHAR', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Ação de Fechar
        closeBtn.on('pointerdown', () => {
            this.instructionsGroup.clear(true, true); // Destruir todos os filhos do grupo
        });

        // Efeito Hover no botão Fechar
        closeBtn.on('pointerover', () => closeBtn.setFillStyle(0xe74c3c));
        closeBtn.on('pointerout', () => closeBtn.setFillStyle(0xc0392b));

        // Adicionar todos os elementos ao grupo para gestão fácil
        this.instructionsGroup.addMultiple([bg, modal, title, text, closeBtn, closeText]);
    }
}
