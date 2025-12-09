// Base de Dados de Perguntas
// Exporta um array de objetos, onde cada objeto representa uma pergunta do quiz
export const questions = [
    // --- Nível 1: Conhecimento Geral (Fácil) ---
    {
        id: 101, // Identificador único
        subject: 'Geral', // Tema
        difficulty: 1, // Nível de dificuldade (1-4)
        question: 'Qual é a cor de uma banana madura?', // Texto da pergunta
        answers: ['Azul', 'Amarelo', 'Vermelho', 'Roxo'], // Opções de resposta
        correct: 1 // Índice da resposta correta (0-3) -> 'Amarelo'
    },
    {
        id: 102,
        subject: 'Geral',
        difficulty: 1,
        question: 'Qual é o animal que ladra?',
        answers: ['Gato', 'Pássaro', 'Cão', 'Peixe'],
        correct: 2
    },
    {
        id: 103,
        subject: 'Geral',
        difficulty: 1,
        question: 'Quantas pernas tem uma aranha?',
        answers: ['4', '6', '8', '10'],
        correct: 2
    },
    {
        id: 104,
        subject: 'Geografia',
        difficulty: 1,
        question: 'Qual é a capital de Portugal?',
        answers: ['Porto', 'Coimbra', 'Lisboa', 'Faro'],
        correct: 2
    },
    {
        id: 105,
        subject: 'Geral',
        difficulty: 1,
        question: 'Onde nasce o Sol?',
        answers: ['Norte', 'Sul', 'Este', 'Oeste'],
        correct: 2
    },
    {
        id: 106,
        subject: 'Geral',
        difficulty: 1,
        question: 'Qual é a cor do céu num dia limpo?',
        answers: ['Verde', 'Azul', 'Cinzento', 'Laranja'],
        correct: 1
    },
    {
        id: 107,
        subject: 'Geral',
        difficulty: 1,
        question: 'Qual destes frutos é vermelho?',
        answers: ['Banana', 'Limão', 'Morango', 'Pera'],
        correct: 2
    },
    {
        id: 108,
        subject: 'Geral',
        difficulty: 1,
        question: 'Qual é o oposto de dia?',
        answers: ['Tarde', 'Manhã', 'Noite', 'Madrugada'],
        correct: 2
    },
    {
        id: 109,
        subject: 'Geral',
        difficulty: 1,
        question: 'Quantos dias tem uma semana?',
        answers: ['5', '6', '7', '8'],
        correct: 2
    },
    {
        id: 110,
        subject: 'Geral',
        difficulty: 1,
        question: 'Qual é a língua oficial do Brasil?',
        answers: ['Espanhol', 'Inglês', 'Português', 'Francês'],
        correct: 2
    },

    // --- Nível 2: História e Geografia de Portugal (Médio) ---
    {
        id: 201,
        subject: 'História',
        difficulty: 2,
        question: 'Quem foi o primeiro rei de Portugal?',
        answers: ['D. Dinis', 'D. Afonso Henriques', 'D. Manuel I', 'D. João I'],
        correct: 1
    },
    {
        id: 202,
        subject: 'História',
        difficulty: 2,
        question: 'Em que ano foi a Implantação da República?',
        answers: ['1910', '1974', '1640', '1143'],
        correct: 0
    },
    {
        id: 203,
        subject: 'Geografia',
        difficulty: 2,
        question: 'Qual é o rio que passa no Porto?',
        answers: ['Tejo', 'Mondego', 'Douro', 'Guadiana'],
        correct: 2
    },
    {
        id: 204,
        subject: 'História',
        difficulty: 2,
        question: 'Quem descobriu o caminho marítimo para a Índia?',
        answers: ['Vasco da Gama', 'Pedro Álvares Cabral', 'Cristóvão Colombo', 'Bartolomeu Dias'],
        correct: 0
    },
    {
        id: 205,
        subject: 'Geografia',
        difficulty: 2,
        question: 'Qual é a cidade conhecida pelos seus canais?',
        answers: ['Braga', 'Aveiro', 'Évora', 'Viseu'],
        correct: 1
    },
    {
        id: 206,
        subject: 'Geografia',
        difficulty: 2,
        question: 'Qual é o ponto mais alto de Portugal Continental?',
        answers: ['Pico', 'Serra da Estrela', 'Gerês', 'Marão'],
        correct: 1
    },
    {
        id: 207,
        subject: 'História',
        difficulty: 2,
        question: 'Em que ano se deu a Restauração da Independência?',
        answers: ['1580', '1640', '1755', '1820'],
        correct: 1
    },
    {
        id: 208,
        subject: 'Geografia',
        difficulty: 2,
        question: 'Qual é o oceano que banha Portugal?',
        answers: ['Pacífico', 'Índico', 'Atlântico', 'Ártico'],
        correct: 2
    },
    {
        id: 209,
        subject: 'Geografia',
        difficulty: 2,
        question: 'Qual arquipélago português tem 9 ilhas?',
        answers: ['Madeira', 'Açores', 'Berlengas', 'Cabo Verde'],
        correct: 1
    },
    {
        id: 210,
        subject: 'Geografia',
        difficulty: 2,
        question: 'Qual é a capital da Alemanha?',
        answers: ['Berlim', 'Paris', 'Londres', 'Madrid'],
        correct: 0
    },

    // --- Nível 3: Ciências e Matemática (Difícil) ---
    {
        id: 301,
        subject: 'Ciências',
        difficulty: 3,
        question: 'Qual é o símbolo químico da água?',
        answers: ['CO2', 'H2O', 'O2', 'NaCl'],
        correct: 1
    },
    {
        id: 302,
        subject: 'Ciências',
        difficulty: 3,
        question: 'Qual é conhecido como o Planeta Vermelho?',
        answers: ['Vénus', 'Júpiter', 'Marte', 'Saturno'],
        correct: 2
    },
    {
        id: 303,
        subject: 'Matemática',
        difficulty: 3,
        question: 'Qual é a raiz quadrada de 144?',
        answers: ['10', '11', '12', '14'],
        correct: 2
    },
    {
        id: 304,
        subject: 'Ciências',
        difficulty: 3,
        question: 'Qual é o órgão responsável por bombear o sangue?',
        answers: ['Pulmão', 'Cérebro', 'Fígado', 'Coração'],
        correct: 3
    },
    {
        id: 305,
        subject: 'Ciências',
        difficulty: 3,
        question: 'Qual é o maior mamífero do mundo?',
        answers: ['Elefante', 'Baleia Azul', 'Girafa', 'Hipopótamo'],
        correct: 1
    },
    {
        id: 306,
        subject: 'Matemática',
        difficulty: 3,
        question: 'Quanto é 7 x 8?',
        answers: ['54', '56', '58', '62'],
        correct: 1
    },
    {
        id: 307,
        subject: 'Ciências',
        difficulty: 3,
        question: 'Qual é o gás essencial para a respiração humana?',
        answers: ['Hélio', 'Azoto', 'Oxigénio', 'Carbono'],
        correct: 2
    },
    {
        id: 308,
        subject: 'Matemática',
        difficulty: 3,
        question: 'Quantos lados tem um hexágono?',
        answers: ['5', '6', '7', '8'],
        correct: 1
    },
    {
        id: 309,
        subject: 'Ciências',
        difficulty: 3,
        question: 'A que temperatura ferve a água (ao nível do mar)?',
        answers: ['90ºC', '100ºC', '110ºC', '120ºC'],
        correct: 1
    },
    {
        id: 310,
        subject: 'Ciências',
        difficulty: 3,
        question: 'Qual é a velocidade aproximada da luz?',
        answers: ['300 km/s', '300.000 km/s', '3.000 km/s', '30.000 km/s'],
        correct: 1
    },

    // --- Nível 4: Cultura e Literatura (Especialista) ---
    {
        id: 401,
        subject: 'Literatura',
        difficulty: 4,
        question: 'Quem escreveu "Os Lusíadas"?',
        answers: ['Fernando Pessoa', 'Luís de Camões', 'Eça de Queirós', 'Saramago'],
        correct: 1
    },
    {
        id: 402,
        subject: 'Literatura',
        difficulty: 4,
        question: 'Quem foi o único Prémio Nobel da Literatura português?',
        answers: ['José Saramago', 'Lobo Antunes', 'Sophia de Mello Breyner', 'Pessoa'],
        correct: 0
    },
    {
        id: 403,
        subject: 'Literatura',
        difficulty: 4,
        question: 'Quem escreveu a obra "Mensagem"?',
        answers: ['Luís de Camões', 'Fernando Pessoa', 'Almeida Garrett', 'Bocage'],
        correct: 1
    },
    {
        id: 404,
        subject: 'Cultura',
        difficulty: 4,
        question: 'O Fado foi classificado pela UNESCO como Património...',
        answers: ['Mundial', 'Natural', 'Imaterial da Humanidade', 'Arquitetónico'],
        correct: 2
    },
    {
        id: 405,
        subject: 'Arte',
        difficulty: 4,
        question: 'Quem pintou o famoso quadro "O Fado"?',
        answers: ['Amadeo de Souza-Cardoso', 'Paula Rego', 'José Malhoa', 'Columbano'],
        correct: 2
    },
    {
        id: 406,
        subject: 'Literatura',
        difficulty: 4,
        question: 'Qual heterónimo de Fernando Pessoa era engenheiro naval?',
        answers: ['Alberto Caeiro', 'Ricardo Reis', 'Álvaro de Campos', 'Bernardo Soares'],
        correct: 2
    },
    {
        id: 407,
        subject: 'Literatura',
        difficulty: 4,
        question: 'Quem é o autor do romance "Os Maias"?',
        answers: ['Camilo Castelo Branco', 'Eça de Queirós', 'Júlio Dinis', 'Vergílio Ferreira'],
        correct: 1
    },
    {
        id: 408,
        subject: 'História',
        difficulty: 4,
        question: 'Qual rainha portuguesa ficou conhecida pelo Milagre das Rosas?',
        answers: ['D. Filipa de Lencastre', 'D. Leonor', 'D. Isabel', 'D. Maria I'],
        correct: 2
    },
    {
        id: 409,
        subject: 'Arte',
        difficulty: 4,
        question: 'Qual é o estilo arquitetónico do Mosteiro dos Jerónimos?',
        answers: ['Gótico', 'Românico', 'Manuelino', 'Barroco'],
        correct: 2
    },
    {
        id: 410,
        subject: 'Literatura',
        difficulty: 4,
        question: 'Quem escreveu "Amor de Perdição"?',
        answers: ['Eça de Queirós', 'Camilo Castelo Branco', 'Almeida Garrett', 'Alexandre Herculano'],
        correct: 1
    }
];
