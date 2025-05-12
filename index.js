// --- Constantes e Estado Inicial ---
const deckCartas = [
    'AC', 'AD', 'AH', 'AS', '2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S',
    '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S',
    '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S',
    '10C', '10D', '10H', '10S', 'JC', 'JD', 'JH', 'JS', 'QC', 'QD', 'QH', 'QS',
    'KC', 'KD', 'KH', 'KS',
];

const gameState = {
    cartasEmbaralhadas: [...deckCartas],
    maoCPU: [],
    maoHumano: [],
    contadorBaralho: 0,
    cartaRetirada: null, // A carta atualmente no topo da pilha de descarte
    isPlaying: false,
    vezCPU: true,       // true: vez do CPU, false: vez do Humano
    playerAction: 'drawOrTake', // 'drawOrTake' ou 'discard'
    cpuJogando: false,   // Flag para evitar múltiplas execuções da IA
    cpuTimeoutId: null, // ID do timeout para a jogada do CPU
};

// --- Inicialização ---
window.addEventListener('load', () => {
    console.log('Page loaded, initializing game');
    novoJogo();
});

function novoJogo() {
    console.log('Starting new game');
    // Limpa timeouts pendentes
    if (gameState.cpuTimeoutId) {
        clearTimeout(gameState.cpuTimeoutId);
        gameState.cpuTimeoutId = null;
    }

    removeCartasJogadores();
    removeCartaRetirada(); // Limpa a pilha de descarte visual
    gameState.cartasEmbaralhadas = [...deckCartas]; // Copia o deck padrão
    embaralharCartas();
    gameState.contadorBaralho = 0;
    gameState.cartaRetirada = null; // Reseta a carta descartada no estado
    gameState.isPlaying = true;
    gameState.cpuJogando = false;

    darCartasInicio(); // Define gameState.maoCPU e gameState.maoHumano
    darAsCartas();     // Renderiza as cartas nas mãos dos jogadores

    gameState.vezCPU = Math.random() > 0.5; // Sorteia quem começa
    gameState.playerAction = 'drawOrTake'; // Ação inicial é comprar/pegar

    vezDeQuem();           // Atualiza a UI de quem joga
    updateDraggability(); // Configura a interatividade das cartas

    // Se o CPU começa, agenda a jogada dele
    if (gameState.vezCPU) {
        scheduleCPU();
    }
}

// --- Funções Principais do Jogo ---

function embaralharCartas() {
    // Algoritmo Fisher-Yates
    for (let i = gameState.cartasEmbaralhadas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.cartasEmbaralhadas[i], gameState.cartasEmbaralhadas[j]] = [
            gameState.cartasEmbaralhadas[j],
            gameState.cartasEmbaralhadas[i],
        ];
    }
    console.log('Deck shuffled');
}

function darCartasInicio() {
    gameState.maoCPU = gameState.cartasEmbaralhadas.slice(0, 9);
    gameState.maoHumano = gameState.cartasEmbaralhadas.slice(9, 18);
    gameState.contadorBaralho = 18;
    console.log('Initial hands dealt (logic only)');
}

function darAsCartas() {
    // Limpa mãos anteriores antes de renderizar
    document.querySelector('#mao-cpu').innerHTML = '';
    document.querySelector('#mao-humano').innerHTML = '';

    // Renderiza mão do CPU (normalmente virada para baixo, mas aqui vamos mostrar)
    gameState.maoCPU.forEach(cartaId => {
         criarElementoCarta(cartaId, true); // true for CPU
    });
    // Renderiza mão do Humano
    gameState.maoHumano.forEach(cartaId => {
         criarElementoCarta(cartaId, false); // false for Human
    });

    console.log('Cards rendered on screen');
    adicionarClassePosicaoDivs(); // Aplica classes de posicionamento
    updateDraggability(); // Atualiza draggability após renderizar
}

// Compra uma carta do baralho (monte)
function novaCarta() {
    console.log('novaCarta called', { state: { ...gameState } });

    // Validações
    if (!gameState.isPlaying || gameState.vezCPU || gameState.playerAction !== 'drawOrTake') {
        console.log('Blocked novaCarta: Not player turn or wrong action state.');
        alert(gameState.playerAction === 'discard' ? 'Você precisa descartar uma carta.' : 'Não é sua vez ou ação inválida.');
        return;
    }
    if (gameState.contadorBaralho >= gameState.cartasEmbaralhadas.length) {
        alert('O baralho acabou!');
        // Poderia terminar o jogo ou embaralhar descarte aqui, por simplicidade reinicia
        novoJogo();
        return;
    }
    if (gameState.maoHumano.length >= 10) {
        console.log('Blocked novaCarta: Hand size already 10');
        alert('Você já tem 10 cartas, precisa descartar uma.');
        return;
    }

    // Executa a compra
    const cartaComprada = gameState.cartasEmbaralhadas[gameState.contadorBaralho];
    gameState.contadorBaralho++;
    console.log('Player drawing card:', cartaComprada);

    // Adiciona a carta diretamente à mão lógica e visual
    adicionarCartaMao(cartaComprada, false); // false = para Humano

    // Limpa a carta do descarte (se houver alguma sendo mostrada por engano)
    //gameState.cartaRetirada = null; // Não mexe no descarte ao comprar do monte
    //removeCartaRetirada();

    // Atualiza o estado do jogo
    gameState.playerAction = 'discard'; // Próxima ação é descartar
    vezDeQuem(); // Atualiza UI
    updateDraggability(); // Atualiza interatividade
}

// Pega a carta do topo da pilha de descarte
function aceitarCarta(idCarta) {
    console.log('aceitarCarta called', { idCarta, state: { ...gameState } });

    // Validações
    if (!gameState.isPlaying || gameState.vezCPU || gameState.playerAction !== 'drawOrTake') {
        console.log('Blocked aceitarCarta: Not player turn or wrong action state.');
        alert(gameState.playerAction === 'discard' ? 'Você precisa descartar uma carta.' : 'Não é sua vez ou ação inválida.');
        return;
    }
    if (!gameState.cartaRetirada || idCarta !== gameState.cartaRetirada) {
        console.log('Blocked aceitarCarta: No discard available or wrong card ID.');
        alert('Não há carta no descarte para pegar ou ID inválido.');
        return;
    }
    if (gameState.maoHumano.length >= 10) {
        console.log('Blocked aceitarCarta: Hand size already 10');
        alert('Você já tem 10 cartas, precisa descartar uma.');
        return;
    }

    // Executa a ação
    console.log('Player accepting discard card:', idCarta);
    const cardToTake = gameState.cartaRetirada;
    gameState.cartaRetirada = null; // Limpa a carta do estado de descarte
    removeCartaRetirada();         // Remove a carta da área visual de descarte

    adicionarCartaMao(cardToTake, false); // false = para Humano

    // Atualiza o estado do jogo
    gameState.playerAction = 'discard'; // Próxima ação é descartar
    vezDeQuem();
    updateDraggability();
}

// Tenta descartar uma carta da mão (chamado pelo onclick da carta na mão do humano)
function tryDiscard(idCarta) {
    console.log('tryDiscard called for:', idCarta);

    // Validações (redundantes com onclick, mas bom ter)
    if (!gameState.isPlaying || gameState.vezCPU || gameState.playerAction !== 'discard' || gameState.maoHumano.length !== 10) {
        console.log('Discard blocked:', {
            isPlaying: gameState.isPlaying,
            isCPU: gameState.vezCPU,
            playerAction: gameState.playerAction,
            handLength: gameState.maoHumano.length
        });
        alert('Você só pode descartar quando for sua vez, após comprar/pegar, e com 10 cartas na mão.');
        return;
    }

    // Se as validações passarem, executa o descarte
    devolverCarta(idCarta);
}

// Descarta uma carta (chamado por tryDiscard ou jogadaCPU)
// Assume que as validações de turno, ação e tamanho da mão (10) já foram feitas
function devolverCarta(idCarta) {
    console.log(`Attempting to discard: ${idCarta}`);
    if (!gameState.isPlaying) return;

    const isCPU = gameState.vezCPU;
    const mao = isCPU ? gameState.maoCPU : gameState.maoHumano;
    const maoSelector = isCPU ? '#mao-cpu' : '#mao-humano';

    // Encontra o elemento da carta na mão visual
    const cartaImgElement = document.querySelector(`${maoSelector} img[id='${idCarta}']`);
    if (!cartaImgElement) {
        console.error('devolverCarta Error: Card image element not found in hand', idCarta, maoSelector);
        return; // Impede continuar se a carta visual não existe
    }

    // Remove da mão lógica
    const index = mao.indexOf(idCarta);
    if (index > -1) {
        mao.splice(index, 1);
        console.log(`${isCPU ? 'CPU' : 'Human'} discarded: ${idCarta}. Hand size now: ${mao.length}`);
    } else {
        console.error('devolverCarta Error: Card ID not found in logical hand array:', idCarta, mao);
        return; // Impede continuar se a carta lógica não existe
    }

     // Remove o container da carta da mão visual
     const parentContainer = cartaImgElement.parentElement;
     if (parentContainer && parentContainer.classList.contains(isCPU ? 'container' : 'container2')) {
         parentContainer.remove();
     } else {
         cartaImgElement.remove(); // Fallback caso não esteja em um container esperado
     }


    // Define a carta descartada no estado e na UI
    gameState.cartaRetirada = idCarta;
    criarCartaRetirada(idCarta); // Mostra a carta na pilha de descarte

    // --- Fim da Ação de Descarte ---
    adicionarClassePosicaoDivs(); // Reorganiza classes de posição
    updateDraggability(); // Atualiza interatividade

    // Verifica vitória para o jogador que acabou de descartar
    if (verificarVitoria(mao)) { // mao agora tem 9 cartas
        document.getElementById('quem-joga').textContent = isCPU ? 'Vitória CPU!' : 'Vitória Humano!';
        gameState.isPlaying = false;
        console.log(`!!! ${isCPU ? 'CPU' : 'Human'} wins! !!!`);
        updateDraggability(); // Desativa draggability no fim do jogo
        // Limpa timeout da CPU se o humano ganhou
        if (!isCPU && gameState.cpuTimeoutId) {
             clearTimeout(gameState.cpuTimeoutId);
             gameState.cpuTimeoutId = null;
        }
        return; // Fim de jogo
    }

    // Se não houve vitória, passa o turno
    terminarJogada();
}

// Passa o turno para o próximo jogador
function terminarJogada() {
    // Chamado após um descarte válido que não resultou em vitória
    console.log('Switching turn...');

    gameState.vezCPU = !gameState.vezCPU;      // Inverte o turno
    gameState.playerAction = 'drawOrTake'; // Próximo jogador precisa comprar/pegar
    vezDeQuem();                           // Atualiza UI
    updateDraggability();                  // Atualiza interatividade das cartas

    // Torna a carta do descarte clicável para o humano se for a vez dele
    const discardedImg = document.querySelector('.carta-retirada');
    if (discardedImg) {
        if (!gameState.vezCPU) { // Se é a vez do humano
            discardedImg.setAttribute('onclick', `aceitarCarta('${discardedImg.id}')`);
            discardedImg.style.cursor = 'pointer';
        } else { // Vez do CPU
            discardedImg.setAttribute('onclick', '');
            discardedImg.style.cursor = 'default';
        }
    }

    console.log('Turn switched. New state:', { vezCPU: gameState.vezCPU, playerAction: gameState.playerAction });

    // Se for a vez do CPU, agenda a jogada dele
    if (gameState.vezCPU && gameState.isPlaying) {
        scheduleCPU();
    }
}

// --- Lógica da IA (CPU) ---

function scheduleCPU() {
    // Garante que não haja múltiplos timeouts agendados
    if (gameState.cpuTimeoutId) {
        clearTimeout(gameState.cpuTimeoutId);
    }
    // Valida se deve agendar
    if (!gameState.isPlaying || !gameState.vezCPU || gameState.cpuJogando) {
        console.log("Schedule CPU skipped:", { isPlaying: gameState.isPlaying, vezCPU: gameState.vezCPU, cpuJogando: gameState.cpuJogando });
        return;
    }
    console.log("Scheduling CPU move...");
    gameState.cpuTimeoutId = setTimeout(() => {
        // Verifica novamente antes de executar
        if (gameState.isPlaying && gameState.vezCPU && !gameState.cpuJogando) {
            jogadaCPU();
        }
        gameState.cpuTimeoutId = null; // Limpa o ID após execução ou se não executar
    }, 1500); // Delay para o jogador ver o que acontece
}

function jogadaCPU() {
    // Validação inicial
    if (!gameState.vezCPU || !gameState.isPlaying || gameState.cpuJogando || gameState.playerAction !== 'drawOrTake') {
        console.log('jogadaCPU blocked at start', { state: { ...gameState } });
        gameState.cpuJogando = false; // Reseta flag caso tenha entrado aqui por erro
        return;
    }
    gameState.cpuJogando = true; // Marca que a CPU está pensando/agindo
    console.log('--- CPU Turn Start ---');
    console.log('CPU hand:', [...gameState.maoCPU]);
    console.log('Discard pile:', gameState.cartaRetirada);

    // 1. Decidir: Pegar do Descarte ou Comprar do Baralho?
    let pegarDescarte = false;
    if (gameState.cartaRetirada) {
        // Avalia se a carta do descarte é útil
        if (avaliaUtilidade(gameState.cartaRetirada, gameState.maoCPU)) {
            console.log("CPU evaluating discard:", gameState.cartaRetirada, "as useful.");
            pegarDescarte = true;
        } else {
            // Pequena chance aleatória de pegar mesmo se não parecer útil
            // if (Math.random() < 0.1) {
            //     console.log("CPU randomly deciding to take non-useful discard:", gameState.cartaRetirada);
            //     pegarDescarte = true;
            // } else {
                 console.log("CPU deciding NOT to take discard:", gameState.cartaRetirada);
            // }
        }
    }

    let cartaAdicionada = null;

    if (pegarDescarte) {
        cartaAdicionada = gameState.cartaRetirada;
        console.log('CPU takes discarded card:', cartaAdicionada);
        gameState.cartaRetirada = null;
        removeCartaRetirada();
        adicionarCartaMao(cartaAdicionada, true); // true for CPU
    } else {
        // Comprar do baralho se disponível
        if (gameState.contadorBaralho >= gameState.cartasEmbaralhadas.length) {
            alert('O baralho acabou!');
            gameState.cpuJogando = false;
            novoJogo(); // Reinicia o jogo se o baralho acabar na vez do CPU
            return;
        }
        cartaAdicionada = gameState.cartasEmbaralhadas[gameState.contadorBaralho];
        gameState.contadorBaralho++;
        console.log('CPU draws card from deck:', cartaAdicionada);
        adicionarCartaMao(cartaAdicionada, true); // true for CPU
    }

    // Neste ponto, a mão do CPU DEVE ter 10 cartas
    if (gameState.maoCPU.length !== 10) {
        console.error("!!! CPU Logic Error: Hand size is not 10 after draw/take phase.", gameState.maoCPU.length);
        // Tentar recuperar? Por ora, vamos parar a CPU para evitar mais erros.
        gameState.cpuJogando = false;
        // Poderia forçar o fim do turno ou reiniciar o jogo
        alert("Erro na lógica da CPU. Reiniciando jogo.");
        novoJogo();
        return;
    } else {
         console.log('CPU hand after getting card:', [...gameState.maoCPU]);
    }


    // 2. Decidir qual carta Descartar (mão tem 10 cartas)
    gameState.playerAction = 'discard'; // Define a ação como descarte para a lógica seguinte
    const cartaParaDescartar = escolherCartaParaDescartar(gameState.maoCPU);
    console.log('CPU chose to discard:', cartaParaDescartar);

    // 3. Executar o Descarte (após um pequeno delay)
    // A função devolverCarta cuidará da verificação de vitória e passagem de turno.
    setTimeout(() => {
        console.log('CPU executing discard:', cartaParaDescartar);
        // Verifica se ainda é a vez da CPU e se ela precisa descartar
        // (Pode ter mudado se o jogo acabou ou houve erro)
        if(gameState.vezCPU && gameState.playerAction === 'discard' && gameState.isPlaying) {
            devolverCarta(cartaParaDescartar);
        } else {
             console.log("CPU discard skipped due to state change:", { state: {...gameState} });
        }
        gameState.cpuJogando = false; // Marca que a CPU terminou
        console.log('--- CPU Turn End ---');
    }, 1000); // Delay para o descarte ser visível

}

// Avalia se uma carta é potencialmente útil para a mão (heurística simples)
function avaliaUtilidade(carta, mao) {
    const valor = carta.slice(0, -1);
    const naipe = carta.slice(-1);
    const valorNum = getValorNumerico(valor);

    // Verifica se forma um trio
    let countValor = 0;
    mao.forEach(c => { if (c.startsWith(valor)) countValor++; });
    if (countValor >= 2) return true; // Completa um trio

    // Verifica se conecta com 2 cartas para formar sequência
    let vizinhoMenor = false;
    let vizinhoMaior = false;
    mao.forEach(c => {
        if (c.endsWith(naipe)) {
            const vNum = getValorNumerico(c.slice(0, -1));
            if (vNum === valorNum - 1) vizinhoMenor = true;
            if (vNum === valorNum + 1) vizinhoMaior = true;
        }
    });
    if (vizinhoMenor && vizinhoMaior) return true; // Ex: tem 3 e 5, pegar 4

    // Verifica se conecta com 1 carta para formar início/meio de sequência
    if (vizinhoMenor || vizinhoMaior) {
         // É um pouco útil, talvez retornar true? Ou dar peso menor?
         // Por ora, vamos ser simples: se conecta, é útil.
         return true;
    }


    return false; // Não parece imediatamente útil
}

// Escolhe a "pior" carta para descartar da mão (heurística)
function escolherCartaParaDescartar(mao) {
    if (!mao || mao.length === 0) return null;
    // Se a mão não tiver 10 cartas, algo está errado, mas retorna algo
    if (mao.length !== 10) {
        console.warn("escolherCartaParaDescartar called with hand size != 10", mao.length, mao);
        return mao[Math.floor(Math.random() * mao.length)];
    }

    const valores = {}; // Contagem por valor ('A': 1, 'K': 3, ...)
    const naipes = { C: [], D: [], H: [], S: [] }; // Valores numéricos por naipe

    mao.forEach(carta => {
        const valor = carta.slice(0, -1);
        const naipe = carta.slice(-1);
        valores[valor] = (valores[valor] || 0) + 1;
        naipes[naipe].push(getValorNumerico(valor));
    });

    // Ordena os valores dentro de cada naipe para facilitar a análise de sequência
    for (let naipe in naipes) {
        naipes[naipe].sort((a, b) => a - b);
    }

    let piorCarta = mao[0];
    let menorContribuicao = Infinity;

    mao.forEach(carta => {
        const valorStr = carta.slice(0, -1);
        const naipe = carta.slice(-1);
        const valorNum = getValorNumerico(valorStr);
        let contribuicao = 0; // Pontuação de utilidade da carta

        // Contribuição por fazer parte de um SET (par, trio, quadra)
        if (valores[valorStr] >= 2) {
            contribuicao += (valores[valorStr] - 1) * 1.5; // Par=1.5, Trio=3, Quadra=4.5 (Peso maior para sets)
        }

        // Contribuição por fazer parte de uma SEQUÊNCIA
        const naipeArray = naipes[naipe];
        let inSequence = false;
        let seqLen = 0;
        // Verifica se conecta com vizinhos
        const temAnterior = naipeArray.includes(valorNum - 1);
        const temProximo = naipeArray.includes(valorNum + 1);

        if (temAnterior && temProximo) { // Meio de sequência (ex: 3, [4], 5)
             contribuicao += 2;
             inSequence = true;
        } else if (temAnterior || temProximo) { // Ponta de sequência (ex: 3, [4] ou [4], 5)
             contribuicao += 1;
             inSequence = true;
        }
         // Poderia adicionar lógica para verificar comprimento da sequência potencial

        // Avaliação final da carta
        // Queremos descartar a carta com MENOR contribuição
        if (contribuicao < menorContribuicao) {
            menorContribuicao = contribuicao;
            piorCarta = carta;
        }
        // Critério de desempate: Se contribuição é igual, descarta a de maior valor numérico
        else if (contribuicao === menorContribuicao) {
            if (valorNum > getValorNumerico(piorCarta.slice(0, -1))) {
                piorCarta = carta;
            }
        }
    });

    console.log(`Discard evaluation: Worst card=${piorCarta} (Score: ${menorContribuicao.toFixed(1)})`);
    return piorCarta;
}


// --- Verificação de Vitória ---

function getValorNumerico(valor) {
    if (valor === 'A') return 1;
    if (valor === 'J') return 11;
    if (valor === 'Q') return 12;
    if (valor === 'K') return 13;
    return parseInt(valor); // '2'..'10'
}

// Verifica se a mão pode ser totalmente dividida em jogos válidos
function verificarVitoria(maoJogador) {
    const tamanhoMao = maoJogador.length;
    // Condição padrão de vitória no Pife é com 9 cartas (após descarte) ou 10 (se a compra/pega fecha o jogo)
    if (tamanhoMao < 9 || tamanhoMao > 10) {
        //console.log("verificarVitoria: Hand size invalid for win check", tamanhoMao);
        return false;
    }

    console.log("Checking victory for hand:", [...maoJogador]);
    // Usa a função de particionamento recursiva/backtracking
    const canWin = canPartitionHand(maoJogador);
    console.log('Partition Victory Check Result:', canWin);
    return canWin;
}

// Função auxiliar (backtracking) para verificar se a mão pode ser particionada
function canPartitionHand(hand) {
    if (hand.length === 0) return true; // Base case: all cards used

    const handSize = hand.length;
    if (handSize % 3 !== 0 && handSize % 3 !== 1) {
       // Pife geralmente termina com 9 (3x3) ou 10 (3x3 + 1 carta "morta" - menos comum)
       // Se a vitória for estritamente com jogos completos, só 9 é válido
       // Vamos permitir 9 ou 10 (se 10, um jogo de 4 é necessário, ou o modelo é diferente)
       // Simplificação: Pife padrão BR geralmente é bater com 9 cartas formando 3 jogos.
       // Algumas regras permitem bater com 10 se todas formarem jogos (ex: 3 trios + 1 coringa, ou 2 trios + 1 quadra).
       // Vamos focar no modelo de 9 cartas (3 jogos de 3). Se mão for 10, falha aqui.
       // **REVISÃO Pife**: Pode-se bater com 10 se a 10ª carta formar jogo E não precisar descartar.
       // Vamos permitir 9 ou 10. A lógica de partição precisa lidar com isso.
       // Se for 10, precisa ser 2 trios + 1 quadra, ou 1 trio + 1 seq de 7, etc.
    }

    // Processa a mão para facilitar
    const processedHand = hand.map(card => ({
        valueStr: card.slice(0, -1),
        suit: card.slice(-1),
        value: getValorNumerico(card.slice(0, -1)),
        id: card
    })).sort((a, b) => a.value - b.value); // Ordena por valor

    // Tenta encontrar uma partição válida
    return findPartitionRecursive(processedHand);
}

// Função recursiva de backtracking
function findPartitionRecursive(remainingCards) {
    if (remainingCards.length === 0) {
        return true; // Sucesso! Todas as cartas foram usadas em jogos.
    }

    const cardToTry = remainingCards[0]; // Pega a primeira carta restante

    // --- Tenta formar um TRIO (ou Quadra) ---
    const sameValueCards = remainingCards.filter(c => c.value === cardToTry.value);

    // Tenta Trio
    if (sameValueCards.length >= 3) {
        const meldSet3 = sameValueCards.slice(0, 3).map(c => c.id);
        const remainingAfterSet3 = removeCardsById(remainingCards, meldSet3);
        if (findPartitionRecursive(remainingAfterSet3)) {
            //console.log("Found Trio:", meldSet3); // Log de depuração
            return true;
        }
    }
    // Tenta Quadra (se mão permitir, ex: 10 cartas -> 2 trios + 1 quadra)
     if (remainingCards.length >= 4 && sameValueCards.length >= 4) {
         const meldSet4 = sameValueCards.slice(0, 4).map(c => c.id);
         const remainingAfterSet4 = removeCardsById(remainingCards, meldSet4);
         if (findPartitionRecursive(remainingAfterSet4)) {
             //console.log("Found Quadra:", meldSet4); // Log de depuração
             return true;
         }
     }


    // --- Tenta formar uma SEQUÊNCIA ---
    const sameSuitCards = remainingCards.filter(c => c.suit === cardToTry.suit);
    sameSuitCards.sort((a, b) => a.value - b.value); // Ordena por valor dentro do naipe

    // Procura sequências de tamanho 3 ou mais que incluam cardToTry
    for (let len = 3; len <= sameSuitCards.length; len++) {
        // Itera pelas possíveis subsequências de tamanho 'len'
        for (let i = 0; i <= sameSuitCards.length - len; i++) {
            const potentialSeq = sameSuitCards.slice(i, i + len);
            // Verifica se a carta atual (cardToTry) está nesta subsequência
            if (potentialSeq.some(c => c.id === cardToTry.id)) {
                // Verifica se é uma sequência numérica consecutiva
                let isConsecutive = true;
                for (let k = 0; k < len - 1; k++) {
                    if (potentialSeq[k + 1].value !== potentialSeq[k].value + 1) {
                        isConsecutive = false;
                        break;
                    }
                }

                if (isConsecutive) {
                    // Se for uma sequência válida, tenta a recursão com as cartas restantes
                    const meldSeq = potentialSeq.map(c => c.id);
                    const remainingAfterSeq = removeCardsById(remainingCards, meldSeq);
                    if (findPartitionRecursive(remainingAfterSeq)) {
                         //console.log(`Found Sequence (len ${len}):`, meldSeq); // Log de depuração
                        return true;
                    }
                    // Se a recursão falhar, continua procurando outras sequências
                }
            }
        }
    }

    // Se nenhuma formação de jogo (trio, quadra, sequência) funcionou a partir de cardToTry,
    // esta ramificação da recursão falhou.
    return false;
}

// Função auxiliar para remover cartas usadas da lista pelo ID
function removeCardsById(cardList, idsToRemove) {
    const idsSet = new Set(idsToRemove);
    return cardList.filter(card => !idsSet.has(card.id));
}


// --- Funções Auxiliares e de UI ---

// Cria o elemento visual de uma carta e adiciona à mão correta
function criarElementoCarta(idCarta, isCPU) {
     const maoSelector = isCPU ? '#mao-cpu' : '#mao-humano';
     const containerClass = isCPU ? 'container' : 'container2';
     const cardClass = isCPU ? 'jogador-cpu' : 'jogador-humano';
     const local = document.querySelector(maoSelector);

     const container = document.createElement('div');
     container.setAttribute('class', containerClass);

     const img = document.createElement('img');
     img.setAttribute('id', idCarta);
     img.setAttribute('class', cardClass);
     img.src = `./imagens/${idCarta}.png`;
     img.onerror = () => console.error('Failed to load image:', img.src);

     // Define o onclick APENAS para cartas humanas E se for a vez E ação de descarte
     if (!isCPU) {
         img.setAttribute('onclick', `tryDiscard('${idCarta}')`);
         // A lógica dentro de tryDiscard fará a validação final
     } else {
         img.setAttribute('onclick', ''); // CPU não é clicável
     }

     container.appendChild(img);
     local.appendChild(container);
}

// Adiciona uma carta à mão (lógica e visual)
function adicionarCartaMao(idCarta, isCPU) {
    if (!idCarta) {
        console.error('adicionarCartaMao: No card ID provided');
        return;
    }
    console.log(`Adding card ${idCarta} to ${isCPU ? 'CPU' : 'Human'} hand`);

    const mao = isCPU ? gameState.maoCPU : gameState.maoHumano;
    mao.push(idCarta); // Adiciona à mão lógica

    // Cria e adiciona o elemento visual da carta
    criarElementoCarta(idCarta, isCPU);

    adicionarClassePosicaoDivs(); // Atualiza classes de posicionamento
    updateDraggability(); // Atualiza interatividade
}

// Cria o elemento visual da carta descartada
function criarCartaRetirada(cartaId) {
    if (!cartaId) {
        console.warn('criarCartaRetirada: No card ID provided');
        return;
    }
    console.log('Creating discarded card visual:', cartaId);
    const imagensDiv = document.querySelector('.imagens');
    if (!imagensDiv) {
        console.error('criarCartaRetirada: .imagens div not found');
        return;
    }

    // Remove qualquer carta de descarte anterior
    removeCartaRetirada();

    const img = document.createElement('img');
    img.setAttribute('id', cartaId); // Usa o ID da carta
    img.setAttribute('class', 'carta-retirada');

    // Define onclick: Apenas o HUMANO pode pegar, e SÓ se for a vez dele e ação 'drawOrTake'
    if (!gameState.vezCPU && gameState.playerAction === 'drawOrTake') {
         img.setAttribute('onclick', `aceitarCarta('${cartaId}')`);
         img.style.cursor = 'pointer';
    } else {
         img.setAttribute('onclick', '');
         img.style.cursor = 'default';
    }

    img.src = `./imagens/${cartaId}.png`;
    img.onerror = () => console.error('Failed to load image:', img.src);
    imagensDiv.appendChild(img);
    console.log('Discarded card appended to DOM:', img);
}

// Remove a carta da pilha de descarte visual
function removeCartaRetirada() {
    const img = document.querySelector('.carta-retirada');
    if (img) {
        img.remove();
        // console.log('Removed carta-retirada from DOM');
    }
}

// Limpa as cartas das mãos dos jogadores na UI e no estado
function removeCartasJogadores() {
    document.querySelector('#mao-cpu').innerHTML = '';
    document.querySelector('#mao-humano').innerHTML = '';
    gameState.maoCPU = [];
    gameState.maoHumano = [];
    console.log('Cleared player hands (UI and state)');
}

// Atualiza o texto indicando de quem é a vez
function vezDeQuem() {
    if (!gameState.isPlaying) {
         document.getElementById('quem-joga').textContent = 'Jogo Terminado!';
         return;
     };

    let text = gameState.vezCPU ? 'Vez do CPU' : 'Sua Vez';
    text += gameState.playerAction === 'drawOrTake' ? ' (Comprar ou Pegar)' : ' (Descartar)';
    document.getElementById('quem-joga').textContent = text;
}

// Adiciona classes CSS para posicionamento/estilo das cartas nas mãos
function adicionarClassePosicaoDivs() {
    const divsCPU = document.querySelectorAll('#mao-cpu .container');
    const divsHumano = document.querySelectorAll('#mao-humano .container2');

    divsCPU.forEach((div, index) => {
        const novaClasse = `CPUcarta${index + 1}`;
        // Remove classe antiga de posição se existir e for diferente
        const classeExistente = Array.from(div.classList).find(c => c.startsWith('CPUcarta'));
        if (classeExistente && classeExistente !== novaClasse) div.classList.remove(classeExistente);
        // Adiciona nova classe se não tiver
        if (!div.classList.contains(novaClasse)) div.classList.add(novaClasse);
    });

    divsHumano.forEach((div, index) => {
        const novaClasse = `HUMcarta${index + 1}`;
        const classeExistente = Array.from(div.classList).find(c => c.startsWith('HUMcarta'));
        if (classeExistente && classeExistente !== novaClasse) div.classList.remove(classeExistente);
        if (!div.classList.contains(novaClasse)) div.classList.add(novaClasse);
    });
}

// --- Lógica de Drag and Drop (Arrastar e Soltar) ---

// Atualiza quais cartas são arrastáveis e adiciona/remove listeners
function updateDraggability() {
    if (!gameState.isPlaying) {
        // Se o jogo não está ativo, remove a capacidade de arrastar tudo
         resetDraggableProperties(document.querySelectorAll('.jogador-humano'));
         resetDraggableProperties(document.querySelectorAll('.jogador-cpu'));
         document.querySelectorAll('.jogador-humano').forEach(c => c.setAttribute('draggable', 'false'));
         document.querySelectorAll('.jogador-cpu').forEach(c => c.setAttribute('draggable', 'false'));
         return;
    }

    const dragMaoHumano = document.querySelectorAll('#mao-humano .jogador-humano');
    const dragMaoCPU = document.querySelectorAll('#mao-cpu .jogador-cpu'); // Geralmente não arrastável pelo jogador

    resetDraggableProperties(dragMaoHumano);
    resetDraggableProperties(dragMaoCPU); // Garante limpeza

    // Cartas humanas são arrastáveis
    dragMaoHumano.forEach(carta => {
        carta.setAttribute('draggable', true);
    });
    addDragAndDropEventListeners(dragMaoHumano, '#mao-humano', gameState.maoHumano); // Passa a mão lógica

    // Cartas CPU não são arrastáveis pelo jogador
    dragMaoCPU.forEach(carta => {
        carta.setAttribute('draggable', false);
    });

    // Carta do descarte não é arrastável
    const discardCard = document.querySelector('.carta-retirada');
    if (discardCard) {
        discardCard.setAttribute('draggable', false);
    }
     adicionarClassePosicaoDivs(); // Reaplicar classes após possíveis reordenações
}

// Remove listeners de drag antigos e reseta estilo
function resetDraggableProperties(draggables) {
    draggables.forEach(draggable => {
        if (draggable._dragListeners) {
            ['dragstart', 'dragend', 'dragover', 'drop'].forEach(event => {
                draggable.removeEventListener(event, draggable._dragListeners[event]);
            });
            draggable._dragListeners = null; // Limpa a referência aos listeners antigos
        }
        draggable.style.opacity = 1;
        draggable.classList.remove('dragging');
    });
}

// Adiciona novos listeners de drag and drop
// Modificado para aceitar o seletor do container e a mão lógica
function addDragAndDropEventListeners(draggables, containerSelector, maoLogica) {
    let draggedElement = null; // Elemento HTML que está sendo arrastado
    let draggedId = null;      // ID da carta sendo arrastada

    draggables.forEach(draggable => {
        const dragStart = (e) => {
            draggedElement = e.target; // O <img> que começou a ser arrastado
            draggedId = draggedElement.id;
            // e.dataTransfer.setData('text/plain', draggedId); // Pode ser útil
            setTimeout(() => { // Aplica estilo após o início do drag
                 draggedElement.style.opacity = 0.5;
                 draggedElement.classList.add('dragging');
            }, 0);
            //console.log('Drag start:', draggedId);
        };

        const dragEnd = (e) => {
            // Limpa estilos aplicados durante o drag
            if (draggedElement){
                 draggedElement.style.opacity = 1;
                 draggedElement.classList.remove('dragging');
            }
            //console.log('Drag end:', draggedId);
            draggedElement = null;
            draggedId = null;
            // Reaplicar classes de posicionamento pode ser necessário aqui
            // adicionarClassePosicaoDivs(); // Causa re-renderização visual
        };

        // Armazena os listeners para poder removê-los depois
        draggable._dragListeners = { dragStart, dragEnd };
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
    });

    // Adiciona listeners ao CONTAINER da mão para lidar com drop e dragover
    const container = document.querySelector(containerSelector);
    if(!container) return;

    const dragOver = (e) => {
        e.preventDefault(); // Necessário para permitir o drop
        // Opcional: Adicionar feedback visual sobre onde o drop pode ocorrer
    };

    const drop = (e) => {
        e.preventDefault();
        if (!draggedElement) return; // Só faz algo se um elemento válido foi arrastado

        // Encontra o elemento <img> sobre o qual ocorreu o drop (ou o container)
        const dropTargetElement = e.target;
        let targetContainer = dropTargetElement.closest(containerSelector + ' > div'); // Encontra o div.container/container2 pai

        // Se soltou no container vazio ou entre cartas, targetContainer pode ser null ou o próprio container da mão
        // Precisamos determinar a posição correta para inserir

        if (targetContainer && targetContainer !== draggedElement.parentElement) {
             // Soltou sobre outra carta (no seu container div)
             const allCardContainers = Array.from(container.querySelectorAll(containerSelector + ' > div'));
             const draggedContainer = draggedElement.parentElement;
             const targetIndex = allCardContainers.indexOf(targetContainer);
             const draggedIndex = allCardContainers.indexOf(draggedContainer);

             // Reordena a mão LÓGICA
             const [movedCardData] = maoLogica.splice(draggedIndex, 1);
             maoLogica.splice(targetIndex, 0, movedCardData);

             // Reordena a mão VISUAL (move o container do elemento arrastado)
             if (targetIndex > draggedIndex) {
                  container.insertBefore(draggedContainer, targetContainer.nextSibling);
             } else {
                  container.insertBefore(draggedContainer, targetContainer);
             }

             console.log(`Moved ${draggedId} from index ${draggedIndex} to ${targetIndex}`);
             adicionarClassePosicaoDivs(); // Atualiza classes CSS de posição após reordenar
        } else {
             // Poderia adicionar lógica para soltar no final da mão se não for sobre outra carta
             console.log("Drop target not a valid card container or dropped on self.");
        }

         // Limpa estilos do drag (redundante com dragEnd, mas seguro)
         draggedElement.style.opacity = 1;
         draggedElement.classList.remove('dragging');
         draggedElement = null;
         draggedId = null;
    };

     // Remove listeners antigos do container antes de adicionar novos
     if (container._dragListeners) {
         container.removeEventListener('dragover', container._dragListeners.dragOver);
         container.removeEventListener('drop', container._dragListeners.drop);
     }
     // Adiciona novos listeners ao container
     container.addEventListener('dragover', dragOver);
     container.addEventListener('drop', drop);
     container._dragListeners = { dragOver, drop }; // Armazena para limpeza futura
}