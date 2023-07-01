const deckCartas = [
  'AC',
  'AD',
  'AH',
  'AS',
  '2C',
  '2D',
  '2H',
  '2S',
  '3C',
  '3D',
  '3H',
  '3S',
  '4C',
  '4D',
  '4H',
  '4S',
  '5C',
  '5D',
  '5H',
  '5S',
  '6C',
  '6D',
  '6H',
  '6S',
  '7C',
  '7D',
  '7H',
  '7S',
  '8C',
  '8D',
  '8H',
  '8S',
  '9C',
  '9D',
  '9H',
  '9S',
  '10C',
  '10D',
  '10H',
  '10S',
  'JC',
  'JD',
  'JH',
  'JS',
  'QC',
  'QD',
  'QH',
  'QS',
  'KC',
  'KD',
  'KH',
  'KS',
];

window.addEventListener('load', novoJogo);

let cartasEmbaralhadas = [...deckCartas];
let maoCPU = [];
let maoHumano = [];
let contadorBaralho = 0;
let cartaRetirada;
let isPlaying = false;
let vezCPU = true;
let podeVirarCartaCPU = false;
let podeVirarCartaHumano = false;
let cpuTerminou = false;
let humanoTerminou = false;
let virouCartaHumano = false;
let virouCartaCPU = false;

function novoJogo() {
  removeCartasJogadores();
  removeCartaRetirada();
  embaralharCartas();
  const dragMaoHumano = document.querySelectorAll('.jogador-humano');
  const dragMaoCPU = document.querySelectorAll('.jogador-cpu');

  resetDraggableProperties(dragMaoHumano);
  resetDraggableProperties(dragMaoCPU);
  contadorBaralho = 0;
  isPlaying = true;
  darCartasInicio();
  darAsCartas();
  if (!vezCPU) {
    vezCPU = true;
    podeVirarCartaCPU = true;
    podeVirarCartaHumano = false;
    cpuTerminou = false;
    humanoTerminou = true;
    virouCartaHumano = true;
    virouCartaCPU = false;
  } else {
    vezCPU = false;
    podeVirarCartaCPU = false;
    podeVirarCartaHumano = true;
    cpuTerminou = true;
    humanoTerminou = false;
    virouCartaHumano = false;
    virouCartaCPU = true;
  }
  vezDeQuem();
  adicionarClassePosicaoDivs();
  dragFunction();
}

function embaralharCartas() {
  for (let i = cartasEmbaralhadas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = cartasEmbaralhadas[i];
    cartasEmbaralhadas[i] = cartasEmbaralhadas[j];
    cartasEmbaralhadas[j] = temp;
  }
}

function darCartasInicio() {
  for (let i = 0; i < 9; i++) {
    maoCPU.push(cartasEmbaralhadas[contadorBaralho]);
    contadorBaralho++;
  }
  for (let i = 0; i < 9; i++) {
    maoHumano.push(cartasEmbaralhadas[contadorBaralho]);
    contadorBaralho++;
  }
}

function novaCarta() {
  if (!isPlaying) return;
  if (maoCPU.length > 9 || maoHumano.length > 9) return;

  if (contadorBaralho > 52) contadorBaralho = 0;
  cartaRetirada = cartasEmbaralhadas[contadorBaralho];
  contadorBaralho++;
  if (cartaRetirada == undefined) return;

  if (!vezCPU && podeVirarCartaHumano) {
    removeCartaRetirada();
    criarCartaRetirada(cartaRetirada);
    podeVirarCartaHumano = false;
    virouCartaHumano = true;
    virouCartaCPU = false;
  }
  if (vezCPU && podeVirarCartaCPU) {
    removeCartaRetirada();
    criarCartaRetirada(cartaRetirada);
    podeVirarCartaCPU = false;
    virouCartaCPU = true;
    virouCartaHumano = false;
  }
  adicionarClassePosicaoDivs();
  dragFunction();
}

function criarCartaRetirada(cartaRetirada) {
  let img = document.createElement('img');
  img.setAttribute('id', `${cartaRetirada}`);
  img.setAttribute('class', 'carta-retirada');
  img.setAttribute('draggable', true);
  img.setAttribute('onClick', `aceitarCarta('${cartaRetirada}')`);
  img.src = `/imagens/${cartaRetirada}.png`;
  let local = document.querySelector('.imagens');
  local.appendChild(img);
  adicionarClassePosicaoDivs();
  dragFunction();
}

function aceitarCarta(idCarta) {
  if (!isPlaying) return;
  if (cartaRetirada == undefined) return;
  if (maoHumano.length > 9 || maoCPU.length > 9) return;
  adicionarCartaMao(idCarta);
  removeCartaRetirada();
  adicionarClassePosicaoDivs();
  dragFunction();
}

function adicionarCartaMao(idCarta) {
  if (idCarta == undefined) return;
  let carta;
  let local;
  carta = document.querySelector('.carta-retirada');
  carta.removeAttribute('class', 'carta-retirada');
  carta.setAttribute('onClick', `devolverCarta('${idCarta}')`);

  if (vezCPU == true) {
    let container = document.createElement('div');
    container.setAttribute('class', 'container');
    carta.setAttribute('class', 'jogador-cpu');
    local = document.querySelector('#mao-cpu');
    container.appendChild(carta);
    local.appendChild(container);
    maoCPU.push(idCarta);
    virouCartaCPU = true;
  } else {
    let container = document.createElement('div');
    container.setAttribute('class', 'container2');
    carta.setAttribute('class', 'jogador-humano');
    local = document.querySelector('#mao-humano');
    container.appendChild(carta);
    local.appendChild(container);
    maoHumano.push(idCarta);
    virouCartaHumano = true;
  }
  adicionarClassePosicaoDivs();
  dragFunction();
}

function adicionarClassePosicaoDivs() {
  const divs = document.querySelectorAll('.container');
  const divs2 = document.querySelectorAll('.container2');

  divs.forEach((div, index) => {
    const novaClasse = `CPUcarta${index + 1}`;
    const classesDiv = Array.from(div.classList);

    // Verificar se a classe já existe na div
    const classeExistente = classesDiv.find(className =>
      className.startsWith('CPUcarta')
    );

    if (classeExistente === novaClasse) {
      return; // Retornar se a classe for a mesma
    }

    if (classeExistente) {
      div.classList.remove(classeExistente);
    }

    div.classList.add(novaClasse);
  });

  divs2.forEach((divs2, index) => {
    const novaClasse = `HUMcarta${index + 1}`;
    const classesDiv = Array.from(divs2.classList);

    // Verificar se a classe já existe na div
    const classeExistente = classesDiv.find(className =>
      className.startsWith('HUMcarta')
    );

    if (classeExistente === novaClasse) {
      return; // Retornar se a classe for a mesma
    }

    if (classeExistente) {
      divs2.classList.remove(classeExistente);
    }

    divs2.classList.add(novaClasse);
  });
}

function removeCartaRetirada() {
  if (document.querySelector('.carta-retirada')) {
    let img = document.querySelector('.carta-retirada');
    img.parentNode.removeChild(img);
  }
  dragFunction();
}

function removeCartasJogadores() {
  document.querySelectorAll('.cartas-humano').forEach(e => e.remove());
  document.querySelectorAll('.cartas-cpu').forEach(e => e.remove());
  document.querySelectorAll('.jogador-humano').forEach(e => e.remove());
  document.querySelectorAll('.jogador-cpu').forEach(e => e.remove());
  document.querySelectorAll('.container').forEach(e => e.remove());
  document.querySelectorAll('.container2').forEach(e => e.remove());
  maoCPU = [];
  maoHumano = [];
}

function vezDeQuem() {
  if (verificarVitoria === true) return;
  if (vezCPU) document.getElementById('quem-joga').textContent = 'Vez do CPU!';
  else document.getElementById('quem-joga').textContent = 'Sua vez!';
}

function darAsCartas() {
  maoCPU.forEach(e => {
    let container = document.createElement('div');
    container.setAttribute('class', 'container');
    let img = document.createElement('img');
    img.setAttribute('class', 'jogador-cpu');
    img.setAttribute('id', `${e}`);
    img.setAttribute('draggable', true);
    img.setAttribute('onClick', `devolverCarta('${e}')`);
    img.src = `/imagens/${e}.png`;
    let local = document.querySelector('#mao-cpu');
    container.appendChild(img);
    //local.parentNode.insertBefore(container, local.nextSibling);
    //local.appendChild(img);
    local.appendChild(container);
  });

  maoHumano.forEach(e => {
    let container2 = document.createElement('div');
    container2.setAttribute('class', 'container2');
    let img = document.createElement('img');
    img.setAttribute('class', 'jogador-humano');
    img.setAttribute('id', `${e}`);
    img.setAttribute('draggable', true);
    img.setAttribute('onClick', `devolverCarta('${e}')`);
    img.src = `/imagens/${e}.png`;
    let local = document.querySelector('#mao-humano');
    container2.appendChild(img);
    //local.parentNode.insertBefore(container, local.nextSibling);
    local.appendChild(container2);
  });
}

function devolverCarta(idCarta) {
  if (!isPlaying) return;
  if ((!vezCPU && maoHumano.length != 10) || (vezCPU && maoCPU.length != 10))
    return;
  let carta = idCarta.replace("'", '');
  let cartaImg = document.querySelectorAll(`img[src='/imagens/${carta}.png']`);

  cartaImg[0].parentElement.remove();
  let local = document.querySelector('.imagens');
  local.appendChild(cartaImg[0]);

  if (vezCPU) {
    maoCPU.splice(maoCPU.indexOf(idCarta), 1);
    local = document.querySelector('.jogador-cpu');
  } else {
    maoHumano.splice(maoHumano.indexOf(idCarta), 1);
    local = document.querySelector('.jogador-humano');
  }
  local.setAttribute('onClick', `aceitarCarta('${carta}')`);
  local.setAttribute('class', 'carta-retirada');
  local.setAttribute('id', `${carta}`);
  const dragMaoHumano = document.querySelectorAll('.jogador-humano');
  const dragMaoCPU = document.querySelectorAll('.jogador-cpu');

  resetDraggableProperties(dragMaoHumano);
  resetDraggableProperties(dragMaoCPU);
  dragFunction();
  terminarJogada();
}

function terminarJogada() {
  if (maoHumano.length > 9 || maoCPU.length > 9) return;

  if (verificarVitoria(maoHumano)) {
    document.getElementById('quem-joga').textContent = 'Vitória Humano!';
    isPlaying = false;
    return;
  }
  if (verificarVitoria(maoCPU)) {
    document.getElementById('quem-joga').textContent = 'Vitória CPU!';
    isPlaying = false;
    return;
  }
  if (!vezCPU && virouCartaHumano) {
    vezCPU = true;
    podeVirarCartaCPU = true;
    podeVirarCartaHumano = false;
    cpuTerminou = false;
    humanoTerminou = true;
    virouCartaHumano = false;
  } else if (vezCPU && virouCartaCPU) {
    vezCPU = false;
    podeVirarCartaCPU = false;
    podeVirarCartaHumano = true;
    cpuTerminou = true;
    humanoTerminou = false;
    virouCartaCPU = false;
  }
  const dragMaoHumano = document.querySelectorAll('.jogador-humano');
  const dragMaoCPU = document.querySelectorAll('.jogador-cpu');

  resetDraggableProperties(dragMaoHumano);
  resetDraggableProperties(dragMaoCPU);
  vezDeQuem();
  dragFunction();
}

function verificarVitoria(vetorMaoJogador) {
  let isTrioDeCartasIguais = analisaMao(vetorMaoJogador);
  let valor = verificaSequenciasArray(vetorMaoJogador);
  const dragMaoHumano = document.querySelectorAll('.jogador-humano');
  const dragMaoCPU = document.querySelectorAll('.jogador-cpu');

  resetDraggableProperties(dragMaoHumano);
  resetDraggableProperties(dragMaoCPU);
  if (valor >= 3) {
    return true;
  }
  if (valor < 3) isTrioDeCartasIguais += valor * 3;
  if (isTrioDeCartasIguais >= 9) {
    return true;
  }
  return false;
}

function analisaMao(vetor) {
  let repeticoes;
  let cartaVerificada = [];
  let isTrioDeCartasIguais = 0;
  if (vetor.length >= 9) {
    for (let i = 0; i < vetor.length; i++) {
      if (!cartaVerificada.includes(vetor[i])) {
        cartaVerificada.push(vetor[i]);
        if (startsWithNumber(vetor[i])) {
          repeticoes = verificaRepeticoesArray(vetor, vetor[i].charAt(0));
          if (repeticoes >= 3) {
            isTrioDeCartasIguais++;
          }
          repeticoes = 0;
        } else if (
          !startsWithNumber(vetor[i]) &&
          vetor[i].charAt(0) != undefined
        ) {
          switch (vetor[i].charAt(0)) {
            case 'J':
              repeticoes = verificaRepeticoesArray(vetor, 'J');
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case 'Q':
              repeticoes = verificaRepeticoesArray(vetor, 'Q');
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case 'K':
              repeticoes = verificaRepeticoesArray(vetor, 'K');
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case 'A':
              repeticoes = verificaRepeticoesArray(vetor, 'A');
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
          }
          repeticoes = 0;
        }
      }
      repeticoes = 0;
    }
  }
  return isTrioDeCartasIguais;
}

function startsWithNumber(strg) {
  //vai retornar verdadeiro se o primeiro caractere for numérico.
  let valor = strg.toString();
  return !/[a-z]/.test(valor.charAt(0)) && !/[A-Z]/.test(valor.charAt(0));
}

function verificaRepeticoesArray(vetor, valor) {
  let contador = 0;
  vetor.forEach(v => v.charAt(0) == valor && contador++);
  return contador;
}
//fazendo a verificação de vitória quando são cartas sequenciais do mesmo naipe.
function verificaSequenciasArray(vetor) {
  let sequencias = 0;
  let novaCarta;
  let novoVetor = [];
  let vetorNaipeC = [];
  let vetorNaipeD = [];
  let vetorNaipeH = [];
  let vetorNaipeS = [];

  vetor.forEach(v => {
    switch (v.substr(0, 1)) {
      case 'A':
        novaCarta = '1' + v.substr(1, 1);
        novoVetor.push(novaCarta);
        novaCarta = '14' + v.substr(1, 1);
        novoVetor.push(novaCarta);
        novaCarta = '';
        break;
      case 'J':
        novaCarta = '11' + v.substr(1, 1);
        novoVetor.push(novaCarta);
        novaCarta = '';
        break;
      case 'Q':
        novaCarta = '12' + v.substr(1, 1);
        novoVetor.push(novaCarta);
        novaCarta = '';
        break;
      case 'K':
        novaCarta = '13' + v.substr(1, 1);
        novoVetor.push(novaCarta);
        novaCarta = '';
        break;
      default:
        novoVetor.push(v);
    }
  });

  novoVetor.forEach(v => {
    let naipe = v.charAt(v.length - 1);
    let valor = parseInt(v.substr(0, v.length - 1));
    switch (naipe) {
      case 'C':
        vetorNaipeC.push(valor);
        break;
      case 'D':
        vetorNaipeD.push(valor);
        break;
      case 'H':
        vetorNaipeH.push(valor);
        break;
      case 'S':
        vetorNaipeS.push(valor);
        break;
    }
  });

  vetorNaipeC.sort((a, b) => a - b);
  vetorNaipeD.sort((a, b) => a - b);
  vetorNaipeH.sort((a, b) => a - b);
  vetorNaipeS.sort((a, b) => a - b);

  sequencias += contarSequencias(vetorNaipeC);
  sequencias += contarSequencias(vetorNaipeD);
  sequencias += contarSequencias(vetorNaipeH);
  sequencias += contarSequencias(vetorNaipeS);

  return sequencias;
}

function contarSequencias(vetor) {
  let contador = 0;
  let sequencias = 0;

  for (let i = 0; i < vetor.length - 1; i++) {
    if (vetor[i + 1] - vetor[i] == 1) {
      contador++;
      if (contador >= 2) {
        sequencias++;
        contador = 0;
      }
    } else {
      contador = 0;
    }
  }

  return sequencias;
}

function contarParesNaipeIgual(vetor) {
  let contador = 1;
  let pares = 0;
  vetor.forEach(v => {
    if (vetor.includes(v + 1)) {
      contador++;
      if (contador == 3) {
        pares++;
        contador = 1;
      }
    }
  });
  return pares;
}

function addDragAndDropEventListeners(draggables, className) {
  if (verificarVitoria == true) return;
  let dragged;

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', e => {
      if (!draggable.classList.contains('dragging')) {
        dragged = e.target;
        e.target.style.opacity = 0.5;
        draggable.classList.add('dragging');
      }
    });

    draggable.addEventListener('dragend', e => {
      e.target.style.opacity = 1;
      draggable.classList.remove('dragging');
    });

    draggable.addEventListener('dragover', e => {
      e.preventDefault();
    });

    draggable.addEventListener('drop', e => {
      e.preventDefault();
      const target = e.target;
      if (target.classList.contains(className)) {
        const carta1 = dragged;
        const carta2 = target;

        // Certifique-se de que as cartas são definidas
        if (!carta1 || !carta2) return;

        const divCarta1 = carta1.parentNode;
        const divCarta2 = carta2.parentNode;

        // Certifique-se de que uma carta está sendo solta em outra carta
        if (!divCarta1 || !divCarta2) return;

        // As cartas devem estar no mesmo contêiner
        if (divCarta1.parentNode !== divCarta2.parentNode) return;

        // Swap das cartas
        const tempNode = document.createElement('div');
        divCarta1.parentNode.insertBefore(tempNode, divCarta1);
        divCarta2.parentNode.insertBefore(divCarta1, divCarta2);
        tempNode.parentNode.insertBefore(divCarta2, tempNode);
        tempNode.parentNode.removeChild(tempNode);
      }
      const dragMaoHumano = document.querySelectorAll('.jogador-humano');
      const dragMaoCPU = document.querySelectorAll('.jogador-cpu');

      resetDraggableProperties(dragMaoHumano);
      resetDraggableProperties(dragMaoCPU);
      adicionarClassePosicaoDivs();
    });
  });
}

function resetDraggableProperties(draggables) {
  draggables.forEach(draggable => {
    draggable.removeEventListener('dragstart', null);
    draggable.removeEventListener('dragend', null);
    draggable.removeEventListener('dragover', null);
    draggable.removeEventListener('drop', null);
    draggable.style.opacity = 1;
    draggable.classList.remove('dragging');
  });
}

function dragFunction() {
  if (verificarVitoria == true) return;
  if (document.getElementById('quem-joga').textContent == 'Vez do CPU!') {
    vezCPU = true;
  }
  if (document.getElementById('quem-joga').textContent == 'Sua vez!') {
    vezCPU = false;
  }
  const dragMaoHumano = document.querySelectorAll('.jogador-humano');
  const dragMaoCPU = document.querySelectorAll('.jogador-cpu');

  resetDraggableProperties(dragMaoHumano);
  resetDraggableProperties(dragMaoCPU);
  adicionarClassePosicaoDivs();

  if (!vezCPU) {
    dragMaoHumano.forEach(carta => {
      carta.setAttribute('draggable', true);
    });
    dragMaoCPU.forEach(carta => {
      carta.setAttribute('draggable', false);
    });
    addDragAndDropEventListeners(dragMaoHumano, 'jogador-humano');
  } else {
    dragMaoCPU.forEach(carta => {
      carta.setAttribute('draggable', true);
    });
    dragMaoHumano.forEach(carta => {
      carta.setAttribute('draggable', false);
    });
    addDragAndDropEventListeners(dragMaoCPU, 'jogador-cpu');
  }
}
