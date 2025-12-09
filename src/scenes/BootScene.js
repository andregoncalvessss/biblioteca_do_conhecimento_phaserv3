// Cena de Inicialização (BootScene)
// Responsável por carregar os recursos (assets) antes do jogo começar
export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene'); // Define a chave única para esta cena
    }

    preload() {
        // Carregar spritesheets das personagens
        // frameWidth e frameHeight definem o tamanho de cada quadro da animação
        this.load.spritesheet('char1', 'assets/character1.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('char2', 'assets/character2.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('char3', 'assets/character3.png', { frameWidth: 512, frameHeight: 512 });

        // Carregar recursos de Interface (UI) e Efeitos Especiais (FX)
        this.load.image('shine', 'assets/shine.png'); // Imagem para o brilho dos livros

        // Carregar Mapas (Tilemaps) e Conjunto de Tiles (Tileset)
        this.load.image('tiles', 'assets/libassetpack-tiled.png'); // A imagem com todas as texturas
        this.load.tilemapTiledJSON('level1', 'assets/biblioteca1.tmj'); // Dados do Nível 1
        this.load.tilemapTiledJSON('level2', 'assets/biblioteca2.tmj'); // Dados do Nível 2
        this.load.tilemapTiledJSON('level3', 'assets/biblioteca3.tmj'); // Dados do Nível 3
        this.load.tilemapTiledJSON('level4', 'assets/biblioteca4.tmj'); // Dados do Nível 4
    }

    create() {
        // Assim que o carregamento terminar, iniciar a cena do Ecrã Inicial (StartScene)
        this.scene.start('StartScene');
    }
}
