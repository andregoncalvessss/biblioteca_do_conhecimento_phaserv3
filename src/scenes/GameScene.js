import { questions } from '../data/questions.js';

// Cena Principal do Jogo (GameScene)
// Onde a ação acontece: exploração, recolha de livros e interação com o mapa
export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene'); // Define a chave única para esta cena
    }

    // Inicialização da cena com dados passados da cena anterior
    init(data) {
        console.log('GameScene: init started', data);
        this.characterType = data.character || 'charA'; // Personagem escolhida
        this.currentLevel = data.level || 1; // Nível atual
        this.score = data.score || 0; // Pontuação total acumulada
        this.levelScore = 1000; // Pontuação potencial deste nível (decresce com o tempo)
        this.booksCollected = 0; // Livros recolhidos neste nível
        this.booksToCollect = 3; // Objetivo de livros para passar de nível
        this.spawnY = data.spawnY || null; // Posição Y de spawn (para transições suaves)
    }

    create() {
        console.log('GameScene: create started');
        try {
            // --- 1. Configuração do Mapa ---
            const mapKey = `level${this.currentLevel}`;
            console.log(`Loading map: ${mapKey}`);

            // Verificar se o mapa existe na cache
            if (!this.cache.tilemap.exists(mapKey)) {
                throw new Error(`Map key '${mapKey}' not found in cache. Did BootScene load it?`);
            }

            // Criar o mapa a partir dos dados JSON
            const map = this.make.tilemap({ key: mapKey });
            console.log('Map created:', map);

            // Obter o nome do tileset definido no Tiled
            if (!map.tilesets || map.tilesets.length === 0) {
                throw new Error("No tilesets found in map data.");
            }
            const tilesetName = map.tilesets[0].name;
            console.log(`Using tileset name from map: ${tilesetName}`);

            // Adicionar a imagem do tileset ao mapa
            const tileset = map.addTilesetImage(tilesetName, 'tiles');

            if (!tileset) {
                throw new Error(`Tileset '${tilesetName}' not found or image 'tiles' not loaded.`);
            }

            // Criar todas as camadas do mapa automaticamente
            this.layers = {};

            // Calcular escala para o mapa preencher o ecrã (Modo Cover)
            const scaleX = this.scale.width / map.widthInPixels;
            const scaleY = this.scale.height / map.heightInPixels;
            this.mapScale = Math.max(scaleX, scaleY);
            console.log(`Map Scale set to: ${this.mapScale}`);

            // Iterar sobre as camadas e criá-las
            map.layers.forEach(layerData => {
                const layer = map.createLayer(layerData.name, tileset, 0, 0);
                layer.setScale(this.mapScale);
                this.layers[layerData.name] = layer;
            });
            console.log('Layers created:', Object.keys(this.layers));

            // --- 2. Limites do Mundo e Câmara ---
            const mapWidth = map.widthInPixels * this.mapScale;
            const mapHeight = map.heightInPixels * this.mapScale;

            this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
            this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

            // --- 3. Interface de Utilizador (UI) ---
            // Texto fixo no ecrã (scrollFactor 0)
            this.levelText = this.add.text(20, 20, `Level: ${this.currentLevel}`, { fontSize: '24px', fill: '#fff' }).setScrollFactor(0);
            this.scoreText = this.add.text(20, 50, `Score: ${this.score + this.levelScore}`, { fontSize: '24px', fill: '#fff' }).setScrollFactor(0);
            this.booksText = this.add.text(20, 80, `Books: 0/${this.booksToCollect}`, { fontSize: '24px', fill: '#fff' }).setScrollFactor(0);

            // Temporizador para decaimento da pontuação (1 ponto por segundo)
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    if (!this.isQuizActive && this.levelScore > 0) {
                        this.levelScore -= 1;
                        this.updateScoreText();
                    }
                },
                loop: true
            });

            // --- 4. Jogador ---
            const charKey = this.characterType || 'char1';
            console.log('Creating player with key:', charKey);

            // Lógica de Spawn (Posição Inicial)
            // Por defeito no lado esquerdo, ou na posição Y passada pela cena anterior
            let startX = 100 * this.mapScale;
            let startY = this.spawnY !== null ? this.spawnY : (300 * this.mapScale);

            // Override para Nível 4: Spawn no canto superior esquerdo
            if (this.currentLevel === 4) {
                startX = 100 * this.mapScale;
                startY = 100 * this.mapScale;
            }

            // Criar sprite do jogador com física
            this.player = this.physics.add.sprite(startX, startY, charKey);
            this.player.setScale(0.20); // Ajustar tamanho

            // Ajustar caixa de colisão (hitbox) para ser mais realista (apenas pés/corpo)
            this.player.body.setSize(160, 320);
            this.player.body.setOffset(176, 190);

            this.player.body.setCollideWorldBounds(true); // Impedir sair do mapa
            this.cameras.main.startFollow(this.player); // Câmara segue o jogador

            // --- 5. Animações ---
            // Criar animações de movimento se não existirem
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

            // --- 6. Colisões ---
            // Função auxiliar para ativar colisão numa camada
            const setCol = (name) => {
                if (this.layers[name]) {
                    this.layers[name].setCollisionByExclusion([-1]); // Colidir com tudo exceto vazio (-1)
                    this.physics.add.collider(this.player, this.layers[name]);
                }
            };

            // Definir obstáculos específicos por nível
            const level1Obstacles = ['balcão', 'estantes', 'mundo', 'cadeiras', 'mesas', 'baú', 'relógio', 'bordas do chão'];
            const level2Obstacles = ['esfera', 'baús', 'livros', 'relógio', 'estantes'];
            const level3Obstacles = ['mesas', 'baú', 'esfera', 'livros', 'relógio', 'estantes', 'balcão'];
            const level4Obstacles = ['decoraçãp', 'decoração', 'caixas', 'baú', 'esfera', 'estantes'];

            let currentObstacles;
            if (this.currentLevel == 2) {
                currentObstacles = level2Obstacles;
            } else if (this.currentLevel == 3) {
                currentObstacles = level3Obstacles;
            } else if (this.currentLevel == 4) {
                currentObstacles = level4Obstacles;
            } else {
                currentObstacles = level1Obstacles;
            }

            console.log(`Configuring collisions for Level ${this.currentLevel}. Obstacles:`, currentObstacles);

            // Aplicar colisões
            currentObstacles.forEach(name => {
                setCol(name);
            });

            // Lógica de Sobreposição de Colisões (Override)
            // Permite andar em cima de tapetes mesmo que haja obstáculos por baixo (ex: balcão)
            if (this.currentLevel == 1 || this.currentLevel == 3) {
                const walkableOverridingLayers = ['tapetes', 'escadas', 'decoração', 'tapetes debaixo da mesa', 'tapete da escada'];
                const obstacleLayers = currentObstacles;

                walkableOverridingLayers.forEach(walkableName => {
                    const walkableLayer = this.layers[walkableName];
                    if (walkableLayer) {
                        walkableLayer.forEachTile(tile => {
                            if (tile.index !== -1) { // Se houver um tile caminhável aqui
                                // Verificar camadas de obstáculos na mesma posição
                                obstacleLayers.forEach(obstacleName => {
                                    const obstacleLayer = this.layers[obstacleName];
                                    if (obstacleLayer) {
                                        const obstacleTile = obstacleLayer.getTileAt(tile.x, tile.y);
                                        if (obstacleTile) {
                                            // Desativar colisão para este tile de obstáculo específico
                                            obstacleTile.setCollision(false, false, false, false);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }

            // --- 7. Controlos ---
            this.cursors = this.input.keyboard.createCursorKeys();

            // --- 8. Livros ---
            this.books = this.physics.add.group();
            this.spawnBooks(mapWidth, mapHeight); // Espalhar livros pelas estantes

            // --- 9. Zona de Transição de Nível ---
            const zoneWidth = 50;
            const zoneHeight = 100;
            let zoneX = mapWidth - 20;
            let zoneY = mapHeight - 150;

            // Override Nível 4: Saída no topo direito
            if (this.currentLevel === 4) {
                zoneX = mapWidth - 50;
                zoneY = 100 * this.mapScale;
            }

            this.transitionZone = this.add.zone(zoneX, zoneY, zoneWidth, zoneHeight);
            this.physics.add.existing(this.transitionZone, true); // Corpo estático

            // Debug visual da zona de saída (verde transparente)
            // const zoneDebug = this.add.rectangle(zoneX, zoneY, zoneWidth, zoneHeight, 0x00ff00, 0.3);
            // zoneDebug.setOrigin(0.5);

            // Verificar sobreposição com a zona de saída
            this.physics.add.overlap(this.player, this.transitionZone, this.handleLevelTransition, null, this);

            // Tecla de Interação
            this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            // Inicializar UI do Quiz
            this.createQuizUI();

            // Gráficos de Debug para raio de interação
            // this.debugGraphics = this.add.graphics().setDepth(999);

            console.log('GameScene: create finished successfully');

        } catch (e) {
            console.error('Error in GameScene create:', e);
            this.add.text(100, 100, `Error: ${e.message}`, { fontSize: '24px', fill: '#ff0000', wordWrap: { width: 1000 } });
        }
    }

    // Atualizar texto da pontuação
    updateScoreText() {
        this.scoreText.setText(`Score: ${this.score + this.levelScore}`);
    }

    update() {
        // Parar movimento se o quiz estiver ativo
        if (this.isQuizActive) return;

        // Visual Debug do Raio de Interação
        /*
        if (this.debugGraphics && this.player) {
            this.debugGraphics.clear();
            this.debugGraphics.lineStyle(2, 0x00ff00, 0.5);

            let topLimit = 275;
            let bottomLimit = 50;
            let rangeXLeft = 100;
            let rangeXRight = 100;

            // Ajuste para Nível 4
            if (this.currentLevel === 4) {
                topLimit = 200;
                bottomLimit = 350;
                rangeXLeft = 200;
                rangeXRight = 100;
            }

            // Desenhar retângulo de interação
            this.debugGraphics.strokeRect(this.player.x - rangeXLeft, this.player.y - topLimit, rangeXLeft + rangeXRight, topLimit + bottomLimit);
        }
        */

        // Lógica de Movimento
        const speed = 200;
        this.player.body.setVelocity(0); // Parar por defeito

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
            // Opcional: Definir frame idle
        }

        // Verificar interação com livros
        this.checkBookInteraction();
    }

    // Espalhar livros pelas estantes
    spawnBooks(mapWidth, mapHeight) {
        console.log('Spawning books on shelves...');
        const shelfLayer = this.layers['estantes'];
        if (!shelfLayer) {
            console.warn("Layer 'estantes' not found! Spawning randomly.");
            return;
        }

        // Encontrar todos os tiles de estante
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

        // Escolher tiles aleatórios para colocar livros
        for (let i = 0; i < this.booksToCollect; i++) {
            const tile = Phaser.Utils.Array.RemoveRandomElement(shelfTiles);
            if (!tile) break;

            const x = tile.getCenterX();
            const y = tile.getCenterY();

            // Criar brilho do livro
            const bookGlow = this.add.sprite(x, y, 'shine');
            bookGlow.setTint(0xffff00); // Brilho dourado
            bookGlow.setScale(0.02);

            // Animação de pulsação
            this.tweens.add({
                targets: bookGlow,
                alpha: 0.5,
                scale: 0.025,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });

            this.books.add(bookGlow);
        }
        console.log('Books (glows) spawned on shelves.');
    }

    // Verificar se o jogador está perto de um livro e pressionou ESPAÇO
    checkBookInteraction() {
        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            const playerCenter = this.player.getCenter();
            let closestBook = null;

            // Definir área de interação
            let rangeXLeft = 100;
            let rangeXRight = 100;
            let topLimit = 275;
            let bottomLimit = 50;

            if (this.currentLevel === 4) {
                topLimit = 200;
                bottomLimit = 350;
                rangeXLeft = 200;
                rangeXRight = 100;
            }

            // Verificar cada livro
            this.books.getChildren().forEach(book => {
                if (book.active) {
                    const bookCenter = book.getCenter();
                    const diffX = bookCenter.x - playerCenter.x;
                    const dy = bookCenter.y - playerCenter.y;

                    // Verificar Horizontal
                    let inRangeX = false;
                    if (diffX < 0) {
                        if (Math.abs(diffX) < rangeXLeft) inRangeX = true;
                    } else {
                        if (diffX < rangeXRight) inRangeX = true;
                    }

                    if (inRangeX) {
                        // Verificar Vertical
                        if (dy > -topLimit && dy < bottomLimit) {
                            // Calcular distância para encontrar o mais próximo
                            const dist = Math.abs(diffX) + Math.abs(dy);
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

    // Criar elementos da UI do Quiz (ocultos inicialmente)
    createQuizUI() {
        this.quizElements = [];

        const addToUI = (obj) => {
            obj.setScrollFactor(0);
            obj.setDepth(1000);
            obj.setVisible(false);
            this.quizElements.push(obj);
            return obj;
        };

        // Fundo
        const bg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.8);
        addToUI(bg);

        // Fundo da Pergunta
        const questionBg = this.add.rectangle(this.scale.width / 2, 200, 800, 150, 0x333333).setStrokeStyle(2, 0xffffff);
        addToUI(questionBg);

        // Texto da Pergunta
        this.questionText = this.add.text(this.scale.width / 2, 200, '', {
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 760 }
        }).setOrigin(0.5);
        addToUI(this.questionText);

        // Botões de Resposta
        this.answerButtons = [];
        for (let i = 0; i < 4; i++) {
            const btnBg = this.add.rectangle(this.scale.width / 2, 350 + (i * 80), 600, 60, 0x555555)
                .setInteractive({ useHandCursor: true })
                .setStrokeStyle(2, 0xffffff);

            const btnText = this.add.text(this.scale.width / 2, 350 + (i * 80), '', {
                fontSize: '24px',
                fill: '#ffffff'
            }).setOrigin(0.5);

            btnBg.on('pointerover', () => btnBg.setFillStyle(0x777777));
            btnBg.on('pointerout', () => btnBg.setFillStyle(0x555555));
            btnBg.on('pointerdown', () => this.handleAnswer(i));

            addToUI(btnBg);
            addToUI(btnText);
            this.answerButtons.push({ bg: btnBg, text: btnText });
        }
    }

    // Ação ao recolher um livro
    collectBook(player, book) {
        book.setVisible(false);
        book.setActive(false);
        this.currentBook = book; // Guardar referência para destruir ou respawnar

        // Filtrar perguntas por dificuldade (nível)
        const availableQuestions = questions.filter(q => q.difficulty === this.currentLevel);

        // Fallback de segurança
        if (availableQuestions.length === 0) {
            console.warn(`No questions found for difficulty ${this.currentLevel}. Using difficulty 1.`);
            availableQuestions.push(...questions.filter(q => q.difficulty === 1));
        }

        // Escolher pergunta aleatória
        const randomQuestion = availableQuestions[Phaser.Math.Between(0, availableQuestions.length - 1)];

        this.showQuiz(randomQuestion);
    }

    // Mostrar o Quiz
    showQuiz(question) {
        this.currentQuestion = question;
        this.isQuizActive = true; // Pausar movimento
        this.player.body.setVelocity(0);
        this.player.anims.stop();

        // Atualizar UI
        this.questionText.setText(question.question);

        question.answers.forEach((ans, index) => {
            if (this.answerButtons[index]) {
                this.answerButtons[index].text.setText(ans);
                this.answerButtons[index].bg.setFillStyle(0x555555);
            }
        });

        // Mostrar elementos
        this.quizElements.forEach(el => el.setVisible(true));
    }

    // Processar resposta
    handleAnswer(selectedIndex) {
        if (!this.isQuizActive) return;

        const isCorrect = (selectedIndex === this.currentQuestion.correct);

        if (isCorrect) {
            // Feedback Correto (Verde)
            this.answerButtons[selectedIndex].bg.setFillStyle(0x00aa00);
            this.time.delayedCall(500, () => {
                this.closeQuiz(true);
            });
        } else {
            // Feedback Errado (Vermelho)
            this.answerButtons[selectedIndex].bg.setFillStyle(0xaa0000);

            // Penalização
            this.levelScore -= 50;
            this.updateScoreText();

            // Mostrar texto de penalização
            const penaltyText = this.add.text(this.scale.width / 2, 100, '-50 Pts', { fontSize: '40px', fill: '#ff0000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(2000).setScrollFactor(0);
            this.tweens.add({
                targets: penaltyText,
                y: 50,
                alpha: 0,
                duration: 1000,
                onComplete: () => penaltyText.destroy()
            });

            this.time.delayedCall(1000, () => {
                this.closeQuiz(false);
            });
        }
    }

    // Fechar Quiz
    closeQuiz(success) {
        this.quizElements.forEach(el => el.setVisible(false));
        this.isQuizActive = false;

        if (success) {
            this.booksCollected++;
            this.updateScoreText();
            this.booksText.setText(`Books: ${this.booksCollected}/${this.booksToCollect}`);

            if (this.currentBook) {
                this.currentBook.destroy(); // Remover livro permanentemente
                this.currentBook = null;
            }
        } else {
            // Resposta errada: Respawnar livro
            if (this.currentBook) {
                this.currentBook.setVisible(true);
                this.currentBook.setActive(true);
                this.currentBook = null;
            }

            // Feedback de tentativa
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

    // Avançar para o próximo nível
    nextLevel() {
        // Adicionar pontuação restante do nível ao total
        const finalLevelScore = Math.max(0, this.levelScore);
        this.score += finalLevelScore;

        if (this.currentLevel >= 4) { // Se for o último nível, ir para o fim
            this.scene.start('EndScene', { score: this.score, win: true });
        } else {
            console.log(`Transitioning to Level ${this.currentLevel + 1}`);
            this.scene.restart({
                character: this.characterType,
                level: this.currentLevel + 1,
                score: this.score,
                spawnY: this.player.y // Manter posição Y relativa
            });
        }
    }

    // Lidar com a transição de nível (zona de saída)
    handleLevelTransition(player, zone) {
        if (this.booksCollected >= this.booksToCollect) {
            this.nextLevel();
        } else {
            // Aviso se não tiver livros suficientes
            if (!this.lastWarningTime || this.time.now - this.lastWarningTime > 2000) {
                const warning = this.add.text(this.player.x, this.player.y - 100, 'Apanha os livros todos primeiro!', {
                    fontSize: '20px',
                    fill: '#ff0000',
                    backgroundColor: '#000000'
                }).setOrigin(0.5).setDepth(2000);

                this.tweens.add({
                    targets: warning,
                    y: warning.y - 50,
                    alpha: 0,
                    duration: 2000,
                    onComplete: () => warning.destroy()
                });
                this.lastWarningTime = this.time.now;
            }
        }
    }
}
