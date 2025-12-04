import { questions } from '../data/questions.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        console.log('GameScene: init started', data);
        this.characterType = data.character || 'charA';
        this.currentLevel = data.level || 1;
        this.score = data.score || 0;
        this.booksCollected = 0;
        this.booksToCollect = 3; // Example requirement
    }

    create() {
        console.log('GameScene: create started');
        try {
            // Setup World from Tilemap
            const mapKey = `level${this.currentLevel}`;
            console.log(`Loading map: ${mapKey}`);

            // Check if map exists
            if (!this.cache.tilemap.exists(mapKey)) {
                throw new Error(`Map key '${mapKey}' not found in cache. Did BootScene load it?`);
            }

            const map = this.make.tilemap({ key: mapKey });
            console.log('Map created:', map);

            // The first parameter is the name of the tileset in Tiled and the second is the key of the image in Phaser
            // We get the tileset name dynamically from the map data to avoid mismatches
            if (!map.tilesets || map.tilesets.length === 0) {
                throw new Error("No tilesets found in map data.");
            }
            const tilesetName = map.tilesets[0].name;
            console.log(`Using tileset name from map: ${tilesetName}`);

            const tileset = map.addTilesetImage(tilesetName, 'tiles');

            if (!tileset) {
                throw new Error(`Tileset '${tilesetName}' not found or image 'tiles' not loaded.`);
            }

            // Create all layers found in the map automatically
            this.layers = {};

            // Calculate scale to make the map fill the screen (Cover mode)
            const scaleX = this.scale.width / map.widthInPixels;
            const scaleY = this.scale.height / map.heightInPixels;
            this.mapScale = Math.max(scaleX, scaleY);
            console.log(`Map Scale set to: ${this.mapScale}`);

            map.layers.forEach(layerData => {
                const layer = map.createLayer(layerData.name, tileset, 0, 0);
                layer.setScale(this.mapScale);
                this.layers[layerData.name] = layer;
            });
            console.log('Layers created:', Object.keys(this.layers));

            // Camera bounds
            const mapWidth = map.widthInPixels * this.mapScale;
            const mapHeight = map.heightInPixels * this.mapScale;

            this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
            this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

            // UI
            this.levelText = this.add.text(20, 20, `Level: ${this.currentLevel}`, { fontSize: '24px', fill: '#fff' }).setScrollFactor(0);
            this.scoreText = this.add.text(20, 50, `Score: ${this.score}`, { fontSize: '24px', fill: '#fff' }).setScrollFactor(0);
            this.booksText = this.add.text(20, 80, `Books: 0/${this.booksToCollect}`, { fontSize: '24px', fill: '#fff' }).setScrollFactor(0);

            // Player
            // Spawn player within bounds (simple default)
            // Using sprite key passed from MenuScene (char1, char2, or char3)
            const charKey = this.characterType || 'char1';
            console.log('Creating player with key:', charKey);

            this.player = this.physics.add.sprite(100 * this.mapScale, 300 * this.mapScale, charKey);
            this.player.setScale(0.20); // Increased scale to 0.20

            // Adjust hitbox (collision box)
            // Frame is 512x512.
            // Width: 160, Height: 320 (taller)
            // Offset X: (512 - 160) / 2 = 176
            // Offset Y: 190 (higher up)
            this.player.body.setSize(160, 320);
            this.player.body.setOffset(176, 190);

            this.player.body.setCollideWorldBounds(true);
            this.cameras.main.startFollow(this.player);

            // Create Animations for this specific character key
            // We need unique animation keys if we want to support different spritesheets later
            // For now, we can just overwrite or use the key prefix
            const animKey = charKey;

            if (!this.anims.exists(`${animKey}_down`)) {
                this.anims.create({
                    key: `${animKey}_down`,
                    frames: this.anims.generateFrameNumbers(charKey, { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: `${animKey}_left`,
                    frames: this.anims.generateFrameNumbers(charKey, { start: 4, end: 7 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: `${animKey}_right`,
                    frames: this.anims.generateFrameNumbers(charKey, { start: 8, end: 11 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.anims.create({
                    key: `${animKey}_up`,
                    frames: this.anims.generateFrameNumbers(charKey, { start: 12, end: 15 }),
                    frameRate: 10,
                    repeat: -1
                });
            }

            // Collisions
            // Helper to set collision if layer exists
            const setCol = (name) => {
                if (this.layers[name]) {
                    this.layers[name].setCollisionByExclusion([-1]);
                    this.physics.add.collider(this.player, this.layers[name]);
                }
            };

            setCol('balcão');
            setCol('estantes');
            setCol('mundo');
            // setCol('tapetes debaixo da mesa'); // Now walkable
            setCol('cadeiras');
            setCol('mesas');
            setCol('baú');
            setCol('relógio');
            // 'bordas do chão' usually implies walls, so keeping it colliding is safer unless user says otherwise.
            setCol('bordas do chão');

            // COLLISION OVERRIDE LOGIC
            // Ensure that if a walkable layer (like 'tapetes') is on top of an obstacle (like 'balcão'),
            // the obstacle's collision is disabled for those specific tiles.
            // REMOVED 'chão' because it exists everywhere and was disabling ALL collisions!
            const walkableOverridingLayers = ['tapetes', 'escadas', 'decoração', 'tapetes debaixo da mesa'];
            const obstacleLayers = ['balcão', 'mesas', 'estantes', 'cadeiras', 'baú', 'relógio', 'mundo'];

            walkableOverridingLayers.forEach(walkableName => {
                const walkableLayer = this.layers[walkableName];
                if (walkableLayer) {
                    walkableLayer.forEachTile(tile => {
                        if (tile.index !== -1) { // If there is a tile here
                            // Check obstacle layers at the same position
                            obstacleLayers.forEach(obstacleName => {
                                const obstacleLayer = this.layers[obstacleName];
                                if (obstacleLayer) {
                                    const obstacleTile = obstacleLayer.getTileAt(tile.x, tile.y);
                                    if (obstacleTile) {
                                        // Disable collision for this specific obstacle tile because a walkable tile is on top
                                        obstacleTile.setCollision(false, false, false, false);
                                    }
                                }
                            });
                        }
                    });
                }
            });

            // Walkable layers (no collision set):
            // 'chão', 'tapetes', 'decoração'

            // Controls
            this.cursors = this.input.keyboard.createCursorKeys();

            // Books
            this.books = this.physics.add.group();
            this.spawnBooks(mapWidth, mapHeight);

            // Librarian (Goal)
            this.librarian = this.add.rectangle(mapWidth - (100 * this.mapScale), mapHeight / 2, 32, 32, 0xffff00);
            this.physics.add.existing(this.librarian, true);

            // Overlaps
            // Overlaps
            // Removed overlap for books, using proximity check instead
            // this.physics.add.overlap(this.player, this.books, this.collectBook, null, this);
            this.physics.add.overlap(this.player, this.librarian, this.meetLibrarian, null, this);

            // Interaction Key
            this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            // Initialize Quiz UI
            this.createQuizUI();

            // Debug Graphics for Interaction Radius
            this.debugGraphics = this.add.graphics().setDepth(999);

            console.log('GameScene: create finished successfully');

        } catch (e) {
            console.error('Error in GameScene create:', e);
            this.add.text(100, 100, `Error: ${e.message}`, { fontSize: '24px', fill: '#ff0000', wordWrap: { width: 1000 } });
        }
    }

    update() {
        // Stop movement if quiz is active
        if (this.isQuizActive) return;

        // Visual Debug for Interaction Radius
        if (this.debugGraphics && this.player) {
            this.debugGraphics.clear();
            this.debugGraphics.lineStyle(2, 0x00ff00, 0.5);
            // Draw rectangle shifted upwards
            // Width: 200, Height: 400
            // Bottom is at player.y + 50 (below feet)
            // Top is at player.y - 350 (high up for shelves)
            this.debugGraphics.strokeRect(this.player.x - 100, this.player.y - 350, 200, 400);
        }

        const speed = 200;
        this.player.body.setVelocity(0);

        const animKey = this.characterType || 'char1';

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
            this.player.anims.play(`${animKey}_left`, true);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
            this.player.anims.play(`${animKey}_right`, true);
        } else if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
            this.player.anims.play(`${animKey}_up`, true);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
            this.player.anims.play(`${animKey}_down`, true);
        } else {
            this.player.anims.stop();
            // Optional: Set idle frame
        }

        // Check for book interaction
        this.checkBookInteraction();
    }

    spawnBooks(mapWidth, mapHeight) {
        console.log('Spawning books on shelves...');
        const shelfLayer = this.layers['estantes'];
        if (!shelfLayer) {
            console.warn("Layer 'estantes' not found! Spawning randomly.");
            // Fallback to random spawning if no shelves
            return;
        }

        const shelfTiles = [];
        shelfLayer.forEachTile(tile => {
            if (tile.index !== -1) {
                shelfTiles.push(tile);
            }
        });

        if (shelfTiles.length === 0) {
            console.warn("No shelf tiles found!");
            return;
        }

        for (let i = 0; i < this.booksToCollect; i++) {
            // Pick a random shelf tile
            const tile = Phaser.Utils.Array.RemoveRandomElement(shelfTiles);
            if (!tile) break;

            // Spawn glow at the center of the tile
            const x = tile.getCenterX();
            const y = tile.getCenterY();

            const bookGlow = this.add.sprite(x, y, 'shine');
            bookGlow.setTint(0xffff00); // Yellow/Gold glow
            bookGlow.setScale(0.02); // 1600px * 0.02 = 32px (fits tile)

            // Add a tween to make it pulse
            this.tweens.add({
                targets: bookGlow,
                alpha: 0.5,
                scale: 0.025, // Pulse slightly larger (not to 1.2!)
                duration: 1000,
                yoyo: true,
                repeat: -1
            });

            this.books.add(bookGlow);
        }
        console.log('Books (glows) spawned on shelves.');
    }

    checkBookInteraction() {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            const playerCenter = this.player.getCenter();
            let closestBook = null;
            // Rectangular interaction area shifted upwards:
            // Horizontal: +/- 100px
            // Vertical: from -350 (up) to +50 (down) relative to player
            const rangeX = 100;
            const topLimit = 350;
            const bottomLimit = 50;

            this.books.getChildren().forEach(book => {
                if (book.active) {
                    const bookCenter = book.getCenter();
                    const dx = Math.abs(playerCenter.x - bookCenter.x);
                    const dy = bookCenter.y - playerCenter.y; // Positive if book is below, negative if above

                    // Check Horizontal
                    if (dx < rangeX) {
                        // Check Vertical (Asymmetric)
                        // Book must be above (dy > -350) and not too far below (dy < 50)
                        // Note: In Phaser Y grows downwards. So "above" is smaller Y (negative dy).
                        if (dy > -topLimit && dy < bottomLimit) {

                            // Calculate distance for sorting
                            const dist = dx + Math.abs(dy);
                            if (!closestBook || dist < (Math.abs(playerCenter.x - closestBook.getCenter().x) + Math.abs(playerCenter.y - closestBook.getCenter().y))) {
                                closestBook = book;
                            }
                        }
                    }
                }
            });

            if (closestBook) {
                this.collectBook(this.player, closestBook);
            }
        }
    }

    createQuizUI() {
        // Store all quiz elements in an array for easy visibility toggling
        this.quizElements = [];

        // Helper to add element to UI
        const addToUI = (obj) => {
            obj.setScrollFactor(0);
            obj.setDepth(1000);
            obj.setVisible(false);
            this.quizElements.push(obj);
            return obj;
        };

        // Background (semi-transparent overlay)
        const bg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.8);
        addToUI(bg);

        // Question Background
        const questionBg = this.add.rectangle(this.scale.width / 2, 200, 800, 150, 0x333333).setStrokeStyle(2, 0xffffff);
        addToUI(questionBg);

        // Question Text
        this.questionText = this.add.text(this.scale.width / 2, 200, '', {
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 760 }
        }).setOrigin(0.5);
        addToUI(this.questionText);

        // Answer Buttons
        this.answerButtons = [];
        for (let i = 0; i < 4; i++) {
            const btnBg = this.add.rectangle(this.scale.width / 2, 350 + (i * 80), 600, 60, 0x555555)
                .setInteractive({ useHandCursor: true })
                .setStrokeStyle(2, 0xffffff);

            const btnText = this.add.text(this.scale.width / 2, 350 + (i * 80), '', {
                fontSize: '24px',
                fill: '#ffffff'
            }).setOrigin(0.5);

            // Button interaction
            btnBg.on('pointerover', () => btnBg.setFillStyle(0x777777));
            btnBg.on('pointerout', () => btnBg.setFillStyle(0x555555));
            btnBg.on('pointerdown', () => this.handleAnswer(i));

            addToUI(btnBg);
            addToUI(btnText);
            this.answerButtons.push({ bg: btnBg, text: btnText });
        }
    }

    collectBook(player, book) {
        // Fix: Don't use disableBody on a regular sprite
        // Just hide it or mark it as collected temporarily
        book.setVisible(false);
        book.setActive(false);
        this.currentBook = book; // Store reference to destroy later or respawn

        // Filter questions by difficulty (level)
        const availableQuestions = questions.filter(q => q.difficulty === this.currentLevel || q.difficulty === 1);
        const randomQuestion = availableQuestions[Phaser.Math.Between(0, availableQuestions.length - 1)];

        this.showQuiz(randomQuestion);
    }

    showQuiz(question) {
        this.currentQuestion = question;
        this.isQuizActive = true; // Flag to pause movement
        this.player.body.setVelocity(0);
        this.player.anims.stop();

        // Update UI
        this.questionText.setText(question.question);

        question.answers.forEach((ans, index) => {
            if (this.answerButtons[index]) {
                this.answerButtons[index].text.setText(ans);
                this.answerButtons[index].bg.setFillStyle(0x555555); // Reset color
            }
        });

        // Show all elements
        this.quizElements.forEach(el => el.setVisible(true));
    }

    handleAnswer(selectedIndex) {
        if (!this.isQuizActive) return;

        const isCorrect = (selectedIndex === this.currentQuestion.correct);

        if (isCorrect) {
            // Visual feedback for correct
            this.answerButtons[selectedIndex].bg.setFillStyle(0x00aa00);
            this.time.delayedCall(500, () => {
                this.closeQuiz(true);
            });
        } else {
            // Visual feedback for wrong
            this.answerButtons[selectedIndex].bg.setFillStyle(0xaa0000);
            this.time.delayedCall(1000, () => {
                this.closeQuiz(false);
            });
        }
    }

    closeQuiz(success) {
        // Hide all elements
        this.quizElements.forEach(el => el.setVisible(false));
        this.isQuizActive = false;

        if (success) {
            this.booksCollected++;
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            this.booksText.setText(`Books: ${this.booksCollected}/${this.booksToCollect}`);

            if (this.currentBook) {
                this.currentBook.destroy(); // Permanently remove
                this.currentBook = null;
            }
        } else {
            // Wrong answer: Respawn book (make visible again)
            if (this.currentBook) {
                this.currentBook.setVisible(true);
                this.currentBook.setActive(true);
                this.currentBook = null;
            }

            // Penalty feedback
            const penaltyText = this.add.text(this.player.x, this.player.y - 50, 'Tenta de novo!', { fontSize: '16px', fill: '#ff0000' })
                .setOrigin(0.5)
                .setDepth(2000);

            this.tweens.add({
                targets: penaltyText,
                y: penaltyText.y - 30,
                alpha: 0,
                duration: 1500,
                onComplete: () => penaltyText.destroy()
            });
        }
    }

    meetLibrarian(player, librarian) {
        if (this.booksCollected >= this.booksToCollect) {
            this.nextLevel();
        } else {
            // Show message: "Bring me more books!"
        }
    }

    nextLevel() {
        if (this.currentLevel >= 4) { // Max level is now 4
            this.scene.start('EndScene', { score: this.score, win: true });
        } else {
            this.scene.restart({
                character: this.characterType,
                level: this.currentLevel + 1,
                score: this.score
            });
        }
    }
}
