export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load assets here
        // Load assets here
        // Load assets here
        this.load.spritesheet('char1', 'assets/character1.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('char2', 'assets/character2.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('char3', 'assets/character3.png', { frameWidth: 512, frameHeight: 512 });

        // Load UI/FX assets
        this.load.image('shine', 'assets/shine.png');

        // Load Tilemaps and Tileset
        this.load.image('tiles', 'assets/libassetpack-tiled.png');
        this.load.tilemapTiledJSON('level1', 'assets/biblioteca1.tmj');
        this.load.tilemapTiledJSON('level2', 'assets/biblioteca2.tmj');
        this.load.tilemapTiledJSON('level3', 'assets/biblioteca3.tmj');
        this.load.tilemapTiledJSON('level4', 'assets/biblioteca4.tmj');
    }

    create() {
        this.scene.start('MenuScene');
    }
}
