const deckCartas = [
  "AC",
  "AD",
  "AH",
  "AS",
  "2C",
  "2D",
  "2H",
  "2S",
  "3C",
  "3D",
  "3H",
  "3S",
  "4C",
  "4D",
  "4H",
  "4S",
  "5C",
  "5D",
  "5H",
  "5S",
  "6C",
  "6D",
  "6H",
  "6S",
  "7C",
  "7D",
  "7H",
  "7S",
  "8C",
  "8D",
  "8H",
  "8S",
  "9C",
  "9D",
  "9H",
  "9S",
  "10C",
  "10D",
  "10H",
  "10S",
  "JC",
  "JD",
  "JH",
  "JS",
  "QC",
  "QD",
  "QH",
  "QS",
  "KC",
  "KD",
  "KH",
  "KS",
];

window.addEventListener("load", novoJogo);

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
  contadorBaralho = 0;
  isPlaying = true;
  darCartasInicio();
  darAsCartas();

  vezCPU = !vezCPU;
  podeVirarCartaCPU = vezCPU;
  podeVirarCartaHumano = !vezCPU;
  cpuTerminou = !vezCPU;
  humanoTerminou = vezCPU;
  virouCartaHumano = vezCPU;
  virouCartaCPU = !vezCPU;
  
  vezDeQuem();
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
  dragFunction();
}


function criarCartaRetirada(cartaRetirada) {
  let img = document.createElement("img");
  img.setAttribute("id", `${cartaRetirada}`);
  img.setAttribute("class", "carta-retirada");
  img.setAttribute("draggable", true);
  img.setAttribute("onClick", `aceitarCarta('${cartaRetirada}')`);
  img.src = `/imagens/${cartaRetirada}.png`;
  let local = document.querySelector(".imagens");
  local.appendChild(img);
}

function aceitarCarta(idCarta) {
  if (!isPlaying) return;
  if (cartaRetirada == undefined) return;
  if (maoHumano.length > 9 || maoCPU.length > 9) return;
  adicionarCartaMao(idCarta);
  removeCartaRetirada();
  dragFunction();
}

function adicionarCartaMao(idCarta) {
  let carta;
  let local;
  carta = document.querySelector(".carta-retirada");
  carta.removeAttribute("class", "carta-retirada");
  carta.removeAttribute("onClick", `aceitarCarta('${idCarta}')`);
  carta.setAttribute("onClick", `devolverCarta('${idCarta}')`);

  if (vezCPU == true) {
    let container = document.createElement("div");
    container.setAttribute("class", "container");
    carta.setAttribute("class", "jogador-cpu");
    local = document.querySelector("#mao-cpu");
    container.appendChild(carta);
    local.appendChild(container);
    maoCPU.push(idCarta);
    virouCartaCPU = true;
    vezCPU = false;
    vezDeQuem();
  }
  if (vezCPU == false) {
    let container = document.createElement("div");
    container.setAttribute("class", "container");
    carta.setAttribute("class", "jogador-humano");
    local = document.querySelector("#mao-humano");
    container.appendChild(carta);
    local.appendChild(container);
    maoHumano.push(idCarta);
    virouCartaHumano = true;
    vezCPU = true;
    vezDeQuem();
  }
}

function removeCartaRetirada() {
  if (document.querySelector(".carta-retirada")) {
    let img = document.querySelector(".carta-retirada");
    img.parentNode.removeChild(img);
  }
}

function removeCartasJogadores() {
  document.querySelectorAll(".cartas-humano").forEach((e) => e.remove());
  document.querySelectorAll(".cartas-cpu").forEach((e) => e.remove());
  document.querySelectorAll(".jogador-humano").forEach((e) => e.remove());
  document.querySelectorAll(".jogador-cpu").forEach((e) => e.remove());
  document.querySelectorAll(".container").forEach((e) => e.remove());
  document.querySelectorAll(".container2").forEach((e) => e.remove());
  maoCPU = [];
  maoHumano = [];
}

function vezDeQuem() {
  if (vezCPU) document.getElementById("quem-joga").textContent = "Vez do CPU!";
  else document.getElementById("quem-joga").textContent = "Sua vez!";
}

function darAsCartas() {
  maoCPU.forEach((e) => {
    let container = document.createElement("div");
    container.setAttribute("class", "container");
    let img = document.createElement("img");
    img.setAttribute("class", "jogador-cpu");
    img.setAttribute("id", `${e}`);
    img.setAttribute("draggable", true);
    img.setAttribute("onClick", `devolverCarta('${e}')`);
    img.src = `/imagens/${e}.png`;
    let local = document.querySelector("#mao-cpu");
    container.appendChild(img);
    //local.parentNode.insertBefore(container, local.nextSibling);
    //local.appendChild(img);
    local.appendChild(container);
  });

  maoHumano.forEach((e) => {
    let container2 = document.createElement("div");
    container2.setAttribute("class", "container2");
    let img = document.createElement("img");
    img.setAttribute("class", "jogador-humano");
    img.setAttribute("id", `${e}`);
    img.setAttribute("draggable", true);
    img.setAttribute("onClick", `devolverCarta('${e}')`);
    img.src = `/imagens/${e}.png`;
    let local = document.querySelector("#mao-humano");
    container2.appendChild(img);
    //local.parentNode.insertBefore(container, local.nextSibling);
    local.appendChild(container2);
  });
}

function devolverCarta(idCarta) {
  if (!isPlaying) return;
  if ((!vezCPU && maoHumano.length !== 10) || (vezCPU && maoCPU.length !== 10)) return;

  let local, carta, cartaRetirada, index;
  if (!vezCPU) {
    local = document.querySelector("#mao-humano");
    carta = local.querySelector(`[onclick="devolverCarta('${idCarta}')"]`);
    index = maoHumano.indexOf(idCarta);
    maoHumano.splice(index, 1);
  } else {
    local = document.querySelector("#mao-cpu");
    carta = local.querySelector(`[onclick="devolverCarta('${idCarta}')"]`);
    index = maoCPU.indexOf(idCarta);
    maoCPU.splice(index, 1);
  }

  cartaRetirada = carta;
  cartaRetirada.setAttribute("class", "carta-retirada");
  cartaRetirada.setAttribute("onClick", `aceitarCarta('${idCarta}')`);
  cartaRetirada.removeAttribute("onClick", `devolverCarta('${idCarta}')`);

  local = document.querySelector("#mesa-jogo");
  local.appendChild(cartaRetirada);
  vezCPU = !vezCPU;
  podeVirarCartaCPU = vezCPU;
  podeVirarCartaHumano = !vezCPU;
  dragFunction();
}

function terminarJogada() {
  if (maoHumano.length > 9 || maoCPU.length > 9) return;

  if (verificarVitoria(maoHumano)) {
    document.getElementById("quem-joga").textContent = "Vitória Humano!";
    isPlaying = false;
    return;
  }
  if (verificarVitoria(maoCPU)) {
    document.getElementById("quem-joga").textContent = "Vitória CPU!";
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
  vezDeQuem();
}

function verificarVitoria(vetorMaoJogador) {
  let isTrioDeCartasIguais = analisaMao(vetorMaoJogador);
  let valor=verificaSequenciasArray(vetorMaoJogador);
  if(valor>=3) return true;
  if(valor<3) isTrioDeCartasIguais+=valor*3;
  if (isTrioDeCartasIguais >= 9) return true;
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
            case "J":
              repeticoes = verificaRepeticoesArray(vetor, "J");
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case "Q":
              repeticoes = verificaRepeticoesArray(vetor, "Q");
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case "K":
              repeticoes = verificaRepeticoesArray(vetor, "K");
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case "A":
              repeticoes = verificaRepeticoesArray(vetor, "A");
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
  vetor.forEach((v) => v.charAt(0) == valor && contador++);
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

  vetor.forEach((v) => {
    switch (v.substr(0,1)) {
      case "A":
        novaCarta = "1" + v.substr(1,1);
        novoVetor.push(novaCarta);
        novaCarta = "14" + v.substr(1,1);
        novoVetor.push(novaCarta);
        novaCarta = "";
        break;
      case "J":
        novaCarta = "11" + v.substr(1,1);
        novoVetor.push(novaCarta);
        novaCarta = "";
        break;
      case "Q":
        novaCarta = "12" + v.substr(1,1);
        novoVetor.push(novaCarta);
        novaCarta = "";
        break;
      case "K":
        novaCarta = "13" + v.substr(1,1);
        novoVetor.push(novaCarta);
        novaCarta = "";
        break;
      default:
        novoVetor.push(v);
    }
  });

  novoVetor.forEach((v) => {
    let naipe = v.charAt(v.length - 1);
    let valor = parseInt(v.substr(0, v.length - 1));
    switch (naipe) {
      case "C":
        vetorNaipeC.push(valor);
        break;
      case "D":
        vetorNaipeD.push(valor);
        break;
      case "H":
        vetorNaipeH.push(valor);
        break;
      case "S":
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

  for(let i = 0; i < vetor.length - 1; i++) {
    if(vetor[i + 1] - vetor[i] == 1) {
      contador++;
      if(contador >= 2) {
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
  vetor.forEach((v) => {
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
  let dragged;

  draggables.forEach((draggable) => {
    draggable.addEventListener("drag", (e) => {}, false);

    draggable.addEventListener(
      "dragstart",
      (e) => {
        dragged = e.target;
        e.target.style.opacity = 0.5;
      },
      false
    );

    draggable.addEventListener(
      "dragend",
      (e) => {
        e.target.style.opacity = "";
      },
      false
    );

    draggable.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
      },
      false
    );

    draggable.addEventListener("dropenter", (e) => {}, false);

    draggable.addEventListener("dropleave", (e) => {}, false);

    draggable.addEventListener(
      "drop",
      (e) => {
        e.preventDefault();
        if (dragged!=undefined && dragged.id != undefined) {
          if (e.target.className == className) {
            let carta = document.getElementById(e.target.id);
            let carta2 = document.getElementById(dragged.id);
            let localCarta = carta.parentNode;
            let localCarta2 = carta2.parentNode;
            localCarta2.appendChild(carta);
            localCarta.appendChild(carta2);
          }
        }
      },
      false
    );
  });
}

function dragFunction() {
  const dragMaoHumano = document.querySelectorAll(".jogador-humano"); //draggable
  const dragMaoCPU = document.querySelectorAll(".jogador-cpu");
  
  if (!vezCPU) {
    addDragAndDropEventListeners(dragMaoHumano, "jogador-humano");
  } else {
    addDragAndDropEventListeners(dragMaoCPU, "jogador-cpu");
  }
}
