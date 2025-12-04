export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        // Background
        this.add.rectangle(0, 0, 1280, 720, 0x2c3e50).setOrigin(0);

        // Title
        this.add.text(640, 100, 'Biblioteca do Conhecimento', {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Character Selection Instructions
        this.add.text(640, 250, 'Escolhe a tua personagem:', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Character Options
        // Using sprites instead of rectangles
        const char1 = this.add.sprite(440, 400, 'char1').setInteractive().setScale(0.5);
        const char2 = this.add.sprite(640, 400, 'char2').setInteractive().setScale(0.5);
        const char3 = this.add.sprite(840, 400, 'char3').setInteractive().setScale(0.5);

        // Apply tints to distinguish them (since they are the same image for now)
        // (Tints removed as we now have distinct images)

        // Labels
        const text1 = this.add.text(440, 500, 'A', { fontSize: '32px' }).setOrigin(0.5);
        const text2 = this.add.text(640, 500, 'B', { fontSize: '32px' }).setOrigin(0.5);
        const text3 = this.add.text(840, 500, 'C', { fontSize: '32px' }).setOrigin(0.5);

        // Selection Logic
        const start = (charKey) => {
            console.log('Selected character:', charKey);
            // Visual feedback
            this.add.text(640, 550, 'A Carregar...', { fontSize: '32px', fill: '#f1c40f' }).setOrigin(0.5);

            // Small delay to let the UI update before freezing if the next scene is heavy
            this.time.delayedCall(100, () => {
                try {
                    this.scene.start('GameScene', { character: charKey, level: 1 });
                } catch (e) {
                    console.error('Error starting GameScene:', e);
                    alert('Error starting game: ' + e.message);
                }
            });
        };

        char1.on('pointerdown', () => start('char1'));
        char2.on('pointerdown', () => start('char2'));
        char3.on('pointerdown', () => start('char3'));

        // Keyboard support
        this.input.keyboard.on('keydown-A', () => start('char1'));
        this.input.keyboard.on('keydown-B', () => start('char2'));
        this.input.keyboard.on('keydown-C', () => start('char3'));
    }

    startGame(character) {
        // Moved logic to 'start' function above
    }
}
