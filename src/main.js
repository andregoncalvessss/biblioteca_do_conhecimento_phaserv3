// Importar as cenas do jogo
import { BootScene } from './scenes/BootScene.js';
import { StartScene } from './scenes/StartScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { QuizScene } from './scenes/QuizScene.js';
import { EndScene } from './scenes/EndScene.js';

// Configuração principal do jogo Phaser
const config = {
    type: Phaser.AUTO, // Escolhe automaticamente WebGL ou Canvas
    title: 'Biblioteca do Conhecimento', // Título do jogo
    description: 'Um jogo educativo na biblioteca', // Descrição
    parent: 'game-container', // ID do elemento HTML onde o jogo será renderizado
    width: 1280, // Largura do jogo em pixeis
    height: 720, // Altura do jogo em pixeis
    backgroundColor: '#000000', // Cor de fundo (preto)
    pixelArt: false, // Desativar modo pixel art (suavizar gráficos)
    physics: {
        default: 'arcade', // Usar o motor de física Arcade
        arcade: {
            gravity: { y: 0 }, // Jogo top-down, sem gravidade vertical
            debug: false // Ativar modo de depuração (caixas de colisão visíveis)
        }
    },
    scene: [ // Lista de cenas do jogo, por ordem de carregamento
        BootScene,
        StartScene,
        MenuScene,
        GameScene,
        QuizScene,
        EndScene
    ],
    scale: {
        mode: Phaser.Scale.FIT, // Ajustar o jogo para caber no ecrã mantendo a proporção
        autoCenter: Phaser.Scale.CENTER_BOTH // Centrar o jogo horizontal e verticalmente
    },
}

// Inicializar o jogo com a configuração definida
new Phaser.Game(config);
