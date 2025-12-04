import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { QuizScene } from './scenes/QuizScene.js';
import { EndScene } from './scenes/EndScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'Biblioteca do Conhecimento',
    description: 'Um jogo educativo na biblioteca',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Top-down game, no gravity
            debug: true
        }
    },
    scene: [
        BootScene,
        MenuScene,
        GameScene,
        QuizScene,
        EndScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
