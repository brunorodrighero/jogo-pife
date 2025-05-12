window.addEventListener('load', () => {
    console.log('Page loaded, initializing game');

    // --- Constantes e Estado Inicial ---
    const deckCartas = [
        'AC', 'AD', 'AH', 'AS', '2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S',
        '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S',
        '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S',
        '10C', '10D', '10H', '10S', 'JC', 'JD', 'JH', 'JS', 'QC', 'QD', 'QH', 'QS',
        'KC', 'KD', 'KH', 'KS',
    ];
    const versoCartaSrc = './imagens/deckofcards.png'; // Imagem usada para o verso das cartas do CPU

    const gameState = {
        cartasEmbaralhadas: [...deckCartas],
        maoCPU: [],
        maoHumano: [],
        contadorBaralho: 0,
        cartaRetirada: null,
        isPlaying: false,
        vezCPU: true,
        playerAction: 'drawOrTake',
        cpuJogando: false,
        cpuTimeoutId: null,
        cpuCardsHidden: true, // Inicia com as cartas do CPU escondidas
    };

    // --- Seletores DOM ---
    const modalInstrucoes = document.getElementById('modal-instrucoes');
    const botaoInstrucoes = document.getElementById('botao-instrucoes');
    const fecharModal = document.getElementById('fechar-modal');
    const botaoNovoJogo = document.getElementById('botao-novo-jogo');
    const botaoNovaCarta = document.getElementById('botao-nova-carta');
    const botaoToggleCpu = document.getElementById('botao-toggle-cpu'); // Botão para mostrar/esconder
    const deckCartasImg = document.getElementById('deck-cartas');
    const maoHumanoDiv = document.getElementById('mao-humano');
    const maoCpuDiv = document.getElementById('mao-cpu');
    const quemJogaDiv = document.getElementById('quem-joga');
    const imagensDiv = document.querySelector('.imagens');


    // --- DEFINIÇÕES DE FUNÇÕES DO JOGO ---

    function novoJogo() {
        console.log('Starting new game');
        if (gameState.cpuTimeoutId) {
            clearTimeout(gameState.cpuTimeoutId);
            gameState.cpuTimeoutId = null;
        }

        removeCartasJogadores();
        removeCartaRetirada();
        gameState.cartasEmbaralhadas = [...deckCartas];
        embaralharCartas();
        gameState.contadorBaralho = 0;
        gameState.cartaRetirada = null;
        gameState.isPlaying = true;
        gameState.cpuJogando = false;
        gameState.cpuCardsHidden = true; // Garante que começa escondido

        darCartasInicio();
        darAsCartas(); // Renderiza cartas (respeitando cpuCardsHidden)

        gameState.vezCPU = Math.random() > 0.5;
        gameState.playerAction = 'drawOrTake';

        vezDeQuem();
        updateDraggability();

        if (gameState.vezCPU) {
            scheduleCPU();
        }
    }

    function embaralharCartas() {
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
        maoCpuDiv.innerHTML = '';
        maoHumanoDiv.innerHTML = '';
        gameState.maoCPU.forEach(cartaId => criarElementoCarta(cartaId, true));
        gameState.maoHumano.forEach(cartaId => criarElementoCarta(cartaId, false));
        console.log('Cards rendered on screen');
        adicionarClassePosicaoDivs();
        // updateDraggability é chamado em novoJogo
    }

    // Atualiza a exibição das cartas do CPU (frente ou verso)
    function updateCpuCardVisibility() {
        const cpuCards = maoCpuDiv.querySelectorAll('img.jogador-cpu');
        console.log(`Updating CPU cards visibility. Hidden: ${gameState.cpuCardsHidden}. Found ${cpuCards.length} cards.`);
        cpuCards.forEach(img => {
            const cardId = img.id;
            if (gameState.cpuCardsHidden) {
                img.src = versoCartaSrc;
            } else {
                img.src = `./imagens/${cardId}.png`;
            }
            img.onerror = () => {
                 console.error('Failed to load image:', img.src);
                 img.src = versoCartaSrc; // Fallback para verso
            };
        });
    }

    function novaCarta() {
        console.log('novaCarta called', { state: { ...gameState } });
        if (!gameState.isPlaying || gameState.vezCPU || gameState.playerAction !== 'drawOrTake') {
            console.log('Blocked novaCarta: Not player turn or wrong action state.');
            alert(gameState.playerAction === 'discard' ? 'Você precisa descartar uma carta.' : 'Não é sua vez ou ação inválida.');
            return;
        }
        if (gameState.contadorBaralho >= gameState.cartasEmbaralhadas.length) {
            alert('O baralho acabou!');
            novoJogo();
            return;
        }
        if (gameState.maoHumano.length >= 10) {
            console.log('Blocked novaCarta: Hand size already 10');
            alert('Você já tem 10 cartas, precisa descartar uma.');
            return;
        }

        const cartaComprada = gameState.cartasEmbaralhadas[gameState.contadorBaralho];
        gameState.contadorBaralho++;
        console.log('Player drawing card:', cartaComprada);
        adicionarCartaMao(cartaComprada, false); // Adiciona à mão humana
        gameState.playerAction = 'discard';
        vezDeQuem();
        updateDraggability();
    }

    function aceitarCarta(idCarta) {
        console.log('aceitarCarta called', { idCarta, state: { ...gameState } });
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

        console.log('Player accepting discard card:', idCarta);
        const cardToTake = gameState.cartaRetirada;
        gameState.cartaRetirada = null;
        removeCartaRetirada();
        adicionarCartaMao(cardToTake, false); // Adiciona à mão humana
        gameState.playerAction = 'discard';
        vezDeQuem();
        updateDraggability();
    }

    function tryDiscard(idCarta) {
        console.log('tryDiscard called for:', idCarta);
        if (!gameState.isPlaying || gameState.vezCPU || gameState.playerAction !== 'discard' || gameState.maoHumano.length !== 10) {
            console.log('Discard blocked:', { /* state */ });
            alert('Você só pode descartar quando for sua vez, após comprar/pegar, e com 10 cartas na mão.');
            return;
        }
        devolverCarta(idCarta);
    }

    function devolverCarta(idCarta) {
        console.log(`Attempting to discard: ${idCarta}`);
        if (!gameState.isPlaying) return;

        const isCPU = gameState.vezCPU;
        const mao = isCPU ? gameState.maoCPU : gameState.maoHumano;
        const maoSelector = isCPU ? '#mao-cpu' : '#mao-humano';
        const cartaImgElement = document.querySelector(`${maoSelector} img[id='${idCarta}']`);

        if (!cartaImgElement) {
            console.error('devolverCarta Error: Card image element not found', idCarta, maoSelector);
            return;
        }

        const index = mao.indexOf(idCarta);
        if (index > -1) {
            mao.splice(index, 1);
            console.log(`${isCPU ? 'CPU' : 'Human'} discarded: ${idCarta}. Hand size: ${mao.length}`);
        } else {
            console.error('devolverCarta Error: Card ID not found in logical hand', idCarta, mao);
            return;
        }

        const parentContainer = cartaImgElement.parentElement;
        if (parentContainer && parentContainer.matches('.container, .container2')) {
            parentContainer.remove();
        } else {
            cartaImgElement.remove();
        }

        gameState.cartaRetirada = idCarta;
        criarCartaRetirada(idCarta); // Mostra no descarte

        adicionarClassePosicaoDivs();
        updateDraggability();

        // Verifica vitória APÓS descarte (mão com 9 ou 10 cartas, dependendo da regra exata)
        // A função verificarVitoria deve lidar com ambos os casos se necessário
        if (verificarVitoria(mao)) {
            quemJogaDiv.textContent = isCPU ? 'Vitória CPU!' : 'Vitória Humano!';
            gameState.isPlaying = false;
            console.log(`!!! ${isCPU ? 'CPU' : 'Human'} wins! !!!`);
            updateDraggability(); // Desativa drag no fim
            if (!isCPU && gameState.cpuTimeoutId) {
                clearTimeout(gameState.cpuTimeoutId);
                gameState.cpuTimeoutId = null;
            }
            return; // Fim de jogo
        }

        // Se não houve vitória, passa o turno
        terminarJogada();
    }

    function terminarJogada() {
        console.log('Switching turn...');
        gameState.vezCPU = !gameState.vezCPU;
        gameState.playerAction = 'drawOrTake';
        vezDeQuem();
        updateDraggability();

        const discardedImg = imagensDiv.querySelector('.carta-retirada');
        if (discardedImg) {
            if (discardedImg._clickListener) {
                discardedImg.removeEventListener('click', discardedImg._clickListener);
                discardedImg._clickListener = null;
            }
            if (!gameState.vezCPU && gameState.playerAction === 'drawOrTake') {
                const listener = () => aceitarCarta(discardedImg.id);
                discardedImg.addEventListener('click', listener);
                discardedImg._clickListener = listener;
                discardedImg.style.cursor = 'pointer';
            } else {
                discardedImg.style.cursor = 'default';
            }
        }

        console.log('Turn switched. New state:', { vezCPU: gameState.vezCPU, playerAction: gameState.playerAction });

        if (gameState.vezCPU && gameState.isPlaying) {
            scheduleCPU();
        }
    }

    // --- Lógica da IA (CPU) ---

    function scheduleCPU() {
        if (gameState.cpuTimeoutId) clearTimeout(gameState.cpuTimeoutId);
        if (!gameState.isPlaying || !gameState.vezCPU || gameState.cpuJogando) {
            console.log("Schedule CPU skipped:", { /* state */ });
            return;
        }
        console.log("Scheduling CPU move...");
        gameState.cpuTimeoutId = setTimeout(() => {
            if (gameState.isPlaying && gameState.vezCPU && !gameState.cpuJogando) {
                jogadaCPU();
            }
            gameState.cpuTimeoutId = null;
        }, 1500);
    }

    function jogadaCPU() {
        if (!gameState.vezCPU || !gameState.isPlaying || gameState.cpuJogando || gameState.playerAction !== 'drawOrTake') {
            console.log('jogadaCPU blocked at start', { state: { ...gameState } });
            gameState.cpuJogando = false;
            return;
        }
        gameState.cpuJogando = true;
        console.log('--- CPU Turn Start ---');
        console.log('CPU hand (logic):', [...gameState.maoCPU]); // Log da mão lógica
        console.log('Discard pile:', gameState.cartaRetirada);

        let pegarDescarte = false;
        if (gameState.cartaRetirada && avaliaUtilidade(gameState.cartaRetirada, gameState.maoCPU)) {
            console.log("CPU evaluating discard:", gameState.cartaRetirada, "as useful.");
            pegarDescarte = true;
        } else if (gameState.cartaRetirada) {
             console.log("CPU deciding NOT to take discard:", gameState.cartaRetirada);
        }

        let cartaAdicionada = null;
        if (pegarDescarte) {
            cartaAdicionada = gameState.cartaRetirada;
            console.log('CPU takes discarded card:', cartaAdicionada);
            gameState.cartaRetirada = null;
            removeCartaRetirada();
            adicionarCartaMao(cartaAdicionada, true); // true for CPU
        } else {
            if (gameState.contadorBaralho >= gameState.cartasEmbaralhadas.length) {
                alert('O baralho acabou!');
                gameState.cpuJogando = false;
                novoJogo();
                return;
            }
            cartaAdicionada = gameState.cartasEmbaralhadas[gameState.contadorBaralho++];
            console.log('CPU draws card from deck:', cartaAdicionada);
            adicionarCartaMao(cartaAdicionada, true); // true for CPU
        }

        if (gameState.maoCPU.length !== 10) {
            console.error("!!! CPU Logic Error: Hand size is not 10 after draw/take phase.", gameState.maoCPU.length);
            gameState.cpuJogando = false;
            alert("Erro na lógica da CPU. Reiniciando jogo.");
            novoJogo();
            return;
        } else {
             console.log('CPU hand (logic) after getting card:', [...gameState.maoCPU]);
        }

        gameState.playerAction = 'discard'; // CPU precisa descartar
        const cartaParaDescartar = escolherCartaParaDescartar(gameState.maoCPU);
        console.log('CPU chose to discard:', cartaParaDescartar);

        // Executa o descarte após delay
        setTimeout(() => {
            console.log('CPU executing discard:', cartaParaDescartar);
            if (gameState.vezCPU && gameState.playerAction === 'discard' && gameState.isPlaying) {
                devolverCarta(cartaParaDescartar); // Chama descarte, que chama terminarJogada
            } else {
                console.log("CPU discard skipped due to state change:", { state: { ...gameState } });
            }
            gameState.cpuJogando = false;
            console.log('--- CPU Turn End ---');
        }, 1000);
    }

    function avaliaUtilidade(carta, mao) {
        const valor = carta.slice(0, -1);
        const naipe = carta.slice(-1);
        const valorNum = getValorNumerico(valor);
        let countValor = 0;
        mao.forEach(c => { if (c.startsWith(valor)) countValor++; });
        if (countValor >= 2) return true; // Faz trio/quadra
        let vizinhoMenor = false;
        let vizinhoMaior = false;
        mao.forEach(c => {
            if (c.endsWith(naipe)) {
                const vNum = getValorNumerico(c.slice(0, -1));
                if (vNum === valorNum - 1) vizinhoMenor = true;
                if (vNum === valorNum + 1) vizinhoMaior = true;
            }
        });
        if (vizinhoMenor || vizinhoMaior) return true; // Ajuda sequência
        return false;
    }

    function escolherCartaParaDescartar(mao) {
        if (!mao || mao.length !== 10) {
            console.warn("escolherCartaParaDescartar called with invalid hand size", mao?.length);
            return mao?.[Math.floor(Math.random() * mao.length)] ?? null; // Fallback aleatório
        }
        const valores = {};
        const naipes = { C: [], D: [], H: [], S: [] };
        mao.forEach(carta => {
            const valor = carta.slice(0, -1);
            const naipe = carta.slice(-1);
            valores[valor] = (valores[valor] || 0) + 1;
            naipes[naipe].push(getValorNumerico(valor));
        });
        for (let naipe in naipes) naipes[naipe].sort((a, b) => a - b);

        let piorCarta = mao[0];
        let menorContribuicao = Infinity;

        mao.forEach(carta => {
            const valorStr = carta.slice(0, -1);
            const naipe = carta.slice(-1);
            const valorNum = getValorNumerico(valorStr);
            let contribuicao = 0;
            if (valores[valorStr] >= 2) contribuicao += (valores[valorStr] - 1) * 1.5;
            const naipeArray = naipes[naipe];
            const temAnterior = naipeArray.includes(valorNum - 1);
            const temProximo = naipeArray.includes(valorNum + 1);
            if (temAnterior && temProximo) contribuicao += 2;
            else if (temAnterior || temProximo) contribuicao += 1;

            if (contribuicao < menorContribuicao) {
                menorContribuicao = contribuicao;
                piorCarta = carta;
            } else if (contribuicao === menorContribuicao) {
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
        if (!valor) return 0;
        if (valor === 'A') return 1; // Ás como 1
        if (valor === 'J') return 11;
        if (valor === 'Q') return 12;
        if (valor === 'K') return 13;
        const num = parseInt(valor); // Para '2' a '10'
        return isNaN(num) ? 0 : num;
    }

    function verificarVitoria(maoJogador) {
        const tamanhoMao = maoJogador.length;
        // Vitória padrão no Pife é com 9 cartas após descarte, formando 3 jogos.
        // Algumas variações permitem bater com 10, mas focaremos em 9.
        if (tamanhoMao !== 9) {
            return false; // Só verifica com 9 cartas
        }
        console.log("Checking victory for 9-card hand:", [...maoJogador]);
        const canWin = canPartitionHand(maoJogador);
        console.log('Partition Victory Check Result:', canWin);
        return canWin;
    }

    function canPartitionHand(hand) {
        if (hand.length === 0) return true; // Condição de sucesso da recursão
        // Se a mão não for múltiplo de 3, não pode formar jogos completos de 3/4.
        // Como estamos verificando apenas mãos de 9, essa checagem é redundante aqui.
        // if (hand.length % 3 !== 0) return false;

        const processedHand = hand.map(card => ({
            valueStr: card.slice(0, -1),
            suit: card.slice(-1),
            value: getValorNumerico(card.slice(0, -1)),
            id: card
        })).sort((a, b) => a.value - b.value); // Ordena por valor

        return findPartitionRecursive(processedHand);
    }

    function findPartitionRecursive(remainingCards) {
        if (remainingCards.length === 0) {
            return true; // Todas as cartas usadas!
        }

        // Pega a primeira carta para tentar formar um jogo
        const cardToTry = remainingCards[0];

        // --- Tenta formar um SET (Trio) ---
        const sameValueCards = remainingCards.filter(c => c.value === cardToTry.value);
        if (sameValueCards.length >= 3) {
            const meldSet3 = sameValueCards.slice(0, 3).map(c => c.id); // Pega os 3 primeiros
            const remainingAfterSet3 = removeCardsById(remainingCards, meldSet3);
            if (findPartitionRecursive(remainingAfterSet3)) { // Chama recursivo
                return true; // Encontrou partição!
            }
        }
        // Tenta Quadra (só se for necessário para variações futuras, Pife padrão usa 3x3=9)
        // if (remainingCards.length >= 4 && sameValueCards.length >= 4) { ... }


        // --- Tenta formar uma SEQUÊNCIA (de 3 ou mais) ---
        const sameSuitCards = remainingCards.filter(c => c.suit === cardToTry.suit);
        sameSuitCards.sort((a, b) => a.value - b.value);

        // Procura sequências de tamanho 'len' (a partir de 3) que incluam cardToTry
        for (let len = 3; len <= sameSuitCards.length; len++) {
            for (let i = 0; i <= sameSuitCards.length - len; i++) {
                const potentialSeq = sameSuitCards.slice(i, i + len);
                // Verifica se a carta atual (cardToTry) está nesta subsequência
                if (potentialSeq.some(c => c.id === cardToTry.id)) {
                    // Verifica se é consecutiva
                    let isConsecutive = true;
                    for (let k = 0; k < len - 1; k++) {
                        // Tratamento especial para Rei->Ás (não padrão no Pife, mas pode ser adicionado)
                        // if (potentialSeq[k].value === 13 && potentialSeq[k+1].value === 1) continue; // Permite K-A?
                        if (potentialSeq[k + 1].value !== potentialSeq[k].value + 1) {
                            isConsecutive = false;
                            break;
                        }
                    }
                    if (isConsecutive) {
                        const meldSeq = potentialSeq.map(c => c.id);
                        const remainingAfterSeq = removeCardsById(remainingCards, meldSeq);
                        if (findPartitionRecursive(remainingAfterSeq)) { // Chama recursivo
                            return true; // Encontrou partição!
                        }
                        // Se não deu certo com essa sequência, continua procurando outras
                    }
                }
            }
        }

        // Se chegou aqui, não conseguiu formar jogo com cardToTry liderando
        return false;
    }

    function removeCardsById(cardList, idsToRemove) {
        const idsSet = new Set(idsToRemove);
        return cardList.filter(card => !idsSet.has(card.id));
    }


    // --- Funções Auxiliares e de UI ---

    function criarElementoCarta(idCarta, isCPU) {
        const maoSelector = isCPU ? '#mao-cpu' : '#mao-humano';
        const containerClass = isCPU ? 'container' : 'container2';
        const cardClass = isCPU ? 'jogador-cpu' : 'jogador-humano';
        const local = document.querySelector(maoSelector);
        if (!local) { console.error(`Container ${maoSelector} not found`); return; }

        const container = document.createElement('div');
        container.className = containerClass;

        const img = document.createElement('img');
        img.id = idCarta;
        img.className = cardClass;

        // Define a imagem inicial baseado no estado cpuCardsHidden
        if (isCPU && gameState.cpuCardsHidden) {
            img.src = versoCartaSrc;
        } else {
            img.src = `./imagens/${idCarta}.png`;
        }
        img.onerror = () => {
             console.error('Failed to load image:', img.src);
             img.src = versoCartaSrc; // Fallback para verso
        };

        // Adiciona listener de clique para descarte APENAS em cartas humanas
        if (!isCPU) {
            if (img._clickListener) img.removeEventListener('click', img._clickListener);
            const listener = () => tryDiscard(idCarta);
            img.addEventListener('click', listener);
            img._clickListener = listener;
        }

        container.appendChild(img);
        local.appendChild(container);
    }

    function adicionarCartaMao(idCarta, isCPU) {
        if (!idCarta) { console.error('adicionarCartaMao: No card ID'); return; }
        console.log(`Adding card ${idCarta} to ${isCPU ? 'CPU' : 'Human'} hand`);
        const mao = isCPU ? gameState.maoCPU : gameState.maoHumano;
        mao.push(idCarta);
        criarElementoCarta(idCarta, isCPU); // Cria o elemento e adiciona listener se humano
        adicionarClassePosicaoDivs();
        updateDraggability(); // Atualiza draggability da mão
    }

    function criarCartaRetirada(cartaId) {
        if (!cartaId) { console.warn('criarCartaRetirada: No card ID'); return; }
        console.log('Creating discarded card visual:', cartaId);
        if (!imagensDiv) { console.error('.imagens div not found'); return; }

        removeCartaRetirada(); // Remove a anterior

        const img = document.createElement('img');
        img.id = cartaId;
        img.className = 'carta-retirada';
        img.src = `./imagens/${cartaId}.png`;
        img.onerror = () => console.error('Failed to load image:', img.src);
        img.setAttribute('draggable', 'false'); // Descarte nunca é arrastável

        // Remove listener antigo antes de adicionar novo
         if (img._clickListener) {
             img.removeEventListener('click', img._clickListener);
             img._clickListener = null;
         }
         // Adiciona listener se for a vez do humano pegar
         if (!gameState.vezCPU && gameState.playerAction === 'drawOrTake') {
             const listener = () => aceitarCarta(cartaId);
             img.addEventListener('click', listener);
             img._clickListener = listener; // Guarda referência
             img.style.cursor = 'pointer';
         } else {
             img.style.cursor = 'default';
         }

        imagensDiv.appendChild(img);
        console.log('Discarded card appended to DOM:', img);
    }

    function removeCartaRetirada() {
        const img = imagensDiv.querySelector('.carta-retirada');
        if (img) {
            if (img._clickListener) img.removeEventListener('click', img._clickListener);
            img.remove();
        }
    }

    function removeCartasJogadores() {
        maoCpuDiv.innerHTML = '';
        maoHumanoDiv.innerHTML = '';
        gameState.maoCPU = [];
        gameState.maoHumano = [];
        console.log('Cleared player hands (UI and state)');
    }

    function vezDeQuem() {
        if (!quemJogaDiv) return;
        if (!gameState.isPlaying) {
            quemJogaDiv.textContent = 'Jogo Terminado!';
            return;
        }
        let text = gameState.vezCPU ? 'Vez do CPU' : 'Sua Vez';
        text += gameState.playerAction === 'drawOrTake' ? ' (Comprar ou Pegar)' : ' (Descartar)';
        quemJogaDiv.textContent = text;
    }

    function adicionarClassePosicaoDivs() {
        const divsCPU = maoCpuDiv.querySelectorAll('.container');
        const divsHumano = maoHumanoDiv.querySelectorAll('.container2');
        divsCPU.forEach((div, index) => {
            const novaClasse = `CPUcarta${index + 1}`;
            const classeExistente = Array.from(div.classList).find(c => c.startsWith('CPUcarta'));
            if (classeExistente && classeExistente !== novaClasse) div.classList.remove(classeExistente);
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

    function updateDraggability() {
        const dragMaoHumano = maoHumanoDiv.querySelectorAll('.jogador-humano');
        const dragMaoCPU = maoCpuDiv.querySelectorAll('.jogador-cpu');

        resetDraggableProperties(dragMaoHumano);
        resetDraggableProperties(dragMaoCPU);

        if (!gameState.isPlaying) {
            dragMaoHumano.forEach(c => c.setAttribute('draggable', 'false'));
            dragMaoCPU.forEach(c => c.setAttribute('draggable', 'false'));
            if (maoHumanoDiv._dragListeners) {
                maoHumanoDiv.removeEventListener('dragover', maoHumanoDiv._dragListeners.dragOver);
                maoHumanoDiv.removeEventListener('drop', maoHumanoDiv._dragListeners.drop);
                maoHumanoDiv._dragListeners = null;
            }
            return;
        }

        dragMaoHumano.forEach(carta => carta.setAttribute('draggable', true));
        addDragAndDropEventListeners(dragMaoHumano, '#mao-humano', gameState.maoHumano);

        dragMaoCPU.forEach(carta => carta.setAttribute('draggable', false)); // CPU não arrastável

        const discardCard = imagensDiv.querySelector('.carta-retirada');
        if (discardCard) discardCard.setAttribute('draggable', 'false');

        adicionarClassePosicaoDivs();
    }

    function resetDraggableProperties(draggables) {
        draggables.forEach(draggable => {
            if (draggable._dragListeners) {
                if (draggable._dragListeners.dragStart) draggable.removeEventListener('dragstart', draggable._dragListeners.dragStart);
                if (draggable._dragListeners.dragEnd) draggable.removeEventListener('dragend', draggable._dragListeners.dragEnd);
            }
            draggable._dragListeners = null;
            draggable.classList.remove('dragging');
        });
    }

    function addDragAndDropEventListeners(draggables, containerSelector, maoLogica) {
        let draggedElement = null;
        let draggedId = null;

        draggables.forEach(draggable => { // draggable é o <img>
            const dragStart = (e) => {
                if (!draggable.classList.contains('jogador-humano')) { e.preventDefault(); return; }
                draggedElement = e.target;
                draggedId = draggedElement.id;
                setTimeout(() => draggedElement.classList.add('dragging'), 0);
            };
            const dragEnd = (e) => {
                if (draggedElement) draggedElement.classList.remove('dragging');
                draggedElement = null;
                draggedId = null;
            };

            if (draggable._dragListeners) { // Remove antes de adicionar
                draggable.removeEventListener('dragstart', draggable._dragListeners.dragStart);
                draggable.removeEventListener('dragend', draggable._dragListeners.dragEnd);
            }
            draggable._dragListeners = { dragStart, dragEnd };
            draggable.addEventListener('dragstart', dragStart);
            draggable.addEventListener('dragend', dragEnd);
        });

        const container = document.querySelector(containerSelector);
        if (!container || containerSelector !== '#mao-humano') return;

        const dragOver = (e) => e.preventDefault();

        const drop = (e) => {
            e.preventDefault();
            if (!draggedElement) return;

            const draggedContainer = draggedElement.parentElement; // div.container2
            const dropTargetElement = e.target;
            let targetCardContainer = dropTargetElement.closest('#mao-humano > div'); // div.container2 alvo

            const allCardContainers = Array.from(container.querySelectorAll('#mao-humano > div'));
            const draggedIndex = allCardContainers.indexOf(draggedContainer);

            if (draggedIndex === -1) return;

            let targetIndex = -1;
            if (targetCardContainer && targetCardContainer !== draggedContainer) {
                targetIndex = allCardContainers.indexOf(targetCardContainer); // Índice visual do alvo
            } else if (dropTargetElement === container) {
                targetIndex = allCardContainers.length; // Indica que é para o final
            } else {
                 if (draggedElement) draggedElement.classList.remove('dragging'); // Limpa visual
                 draggedElement = null; draggedId = null;
                 return; // Drop inválido
            }

            // Reordena Lógica
            const [movedCardId] = maoLogica.splice(draggedIndex, 1);
            if (targetIndex === allCardContainers.length) { // Se soltou no container, vai pro fim
                 maoLogica.push(movedCardId);
            } else if (targetIndex !== -1){
                 maoLogica.splice(targetIndex, 0, movedCardId); // Insere no índice correto
            } else {
                maoLogica.splice(draggedIndex, 0, movedCardId); // Fallback
                console.error("Drop logic error");
            }


            // Reordena Visual
            if (targetIndex === allCardContainers.length) {
                 container.appendChild(draggedContainer); // Move para o final visualmente
            } else if (targetCardContainer && targetCardContainer !== draggedContainer) {
                if (targetIndex > draggedIndex) {
                     container.insertBefore(draggedContainer, targetCardContainer.nextSibling);
                 } else {
                     container.insertBefore(draggedContainer, targetCardContainer);
                 }
            }

            console.log(`Moved ${movedCardId} from visual index ${draggedIndex} near visual index ${targetIndex}`);
            adicionarClassePosicaoDivs(); // Atualiza classes CSS

            if (draggedElement) draggedElement.classList.remove('dragging'); // Limpa visual
            draggedElement = null; draggedId = null;
        };

        if (container._dragListeners) { // Remove listeners do container antes de adicionar
            container.removeEventListener('dragover', container._dragListeners.dragOver);
            container.removeEventListener('drop', container._dragListeners.drop);
        }
        container.addEventListener('dragover', dragOver);
        container.addEventListener('drop', drop);
        container._dragListeners = { dragOver, drop };
    }


    // --- Adiciona Event Listeners Iniciais ---
    if (botaoInstrucoes && modalInstrucoes) {
        botaoInstrucoes.addEventListener('click', () => modalInstrucoes.classList.add('visivel'));
    } else { console.error("Missing Instructions Button or Modal"); }

    if (fecharModal && modalInstrucoes) {
        fecharModal.addEventListener('click', () => modalInstrucoes.classList.remove('visivel'));
        window.addEventListener('click', (event) => {
            if (event.target == modalInstrucoes) modalInstrucoes.classList.remove('visivel');
        });
    } else { console.error("Missing Modal Close Button or Modal"); }

    if (botaoNovoJogo) {
        botaoNovoJogo.addEventListener('click', novoJogo);
    } else { console.error("Missing New Game Button"); }

    if (botaoNovaCarta) {
        botaoNovaCarta.addEventListener('click', novaCarta);
    } else { console.error("Missing New Card Button"); }

    if (deckCartasImg) {
        deckCartasImg.addEventListener('click', novaCarta); // Listener para o deck
    } else { console.error("Missing Deck Image Element"); }

    // Listener para o botão Mostrar/Esconder CPU
    if (botaoToggleCpu) {
        botaoToggleCpu.addEventListener('click', () => {
            gameState.cpuCardsHidden = !gameState.cpuCardsHidden; // Inverte o estado
            updateCpuCardVisibility(); // Atualiza a visualização
        });
    } else { console.error("Missing Toggle CPU Button"); }


    // --- Inicia o Jogo ---
    novoJogo(); // Chama a função para configurar e iniciar o jogo pela primeira vez

}); // Fim do window.addEventListener('load')