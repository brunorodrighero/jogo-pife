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

let cartasEmbaralhadas = deckCartas;
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
  if (maoHumano > 9 || maoCPU > 9) return;
  adicionarCartaMao(idCarta);
  removeCartaRetirada();
  dragFunction();
}

function adicionarCartaMao(idCarta) {
  if (idCarta == undefined) return;
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
  } else {
    let container = document.createElement("div");
    container.setAttribute("class", "container2");
    carta.setAttribute("class", "jogador-humano");
    local = document.querySelector("#mao-humano");
    container.appendChild(carta);
    local.appendChild(container);
    maoHumano.push(idCarta);
    virouCartaHumano = true;
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
  if ((!vezCPU && maoHumano.length != 10) || (vezCPU && maoCPU.length != 10))
    return;
  let carta = idCarta.replace("'", "");
  let cartaImg = document.querySelectorAll(`img[src='/imagens/${carta}.png']`);

  cartaImg[0].parentElement.remove();
  let local = document.querySelector(".imagens");
  local.appendChild(cartaImg[0]);

  if (vezCPU) {
    maoCPU.splice(maoCPU.indexOf(idCarta), 1);
    local = document.querySelector(".jogador-cpu");
  } else {
    maoHumano.splice(maoHumano.indexOf(idCarta), 1);
    local = document.querySelector(".jogador-humano");
  }
  local.setAttribute("onClick", `aceitarCarta('${carta}')`);
  local.setAttribute("class", "carta-retirada");
  local.setAttribute("id", `${carta}`);
  terminarJogada();
}

function terminarJogada() {
  if (maoHumano.length > 9 || maoCPU.length > 9) return;

  if (verificarVitoriaHumano()) {
    document.getElementById("quem-joga").textContent = "Vitória Humano!";
    isPlaying = false;
    return;
  }
  if (verificarVitoriaCPU()) {
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

function verificarVitoriaHumano() {
  let isTrioDeCartasIguais = 0;
  let cartaVerificada = [];
  let repeticoes = 0;
  if (maoHumano.length == 9) {
    for (let i = 0; i < maoHumano.length; i++) {
      if (!cartaVerificada.includes(maoHumano[i])) {
        cartaVerificada.push(maoHumano[i]);
        if (startsWithNumber(maoHumano[i])) {
          repeticoes = verificaRepeticoesArray(
            maoHumano,
            maoHumano[i].charAt(0)
          );
          if (repeticoes >= 3) {
            isTrioDeCartasIguais++;
          }
          repeticoes = 0;
        } else if (
          !startsWithNumber(maoHumano[i]) &&
          maoHumano[i].charAt(0) != undefined
        ) {
          switch (maoHumano[i].charAt(0)) {
            case "J":
              repeticoes = verificaRepeticoesArray(maoHumano, "J");
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case "Q":
              repeticoes = verificaRepeticoesArray(maoHumano, "Q");
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case "K":
              repeticoes = verificaRepeticoesArray(maoHumano, "K");
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
  if (isTrioDeCartasIguais >= 9) return true;
  return false;
}

function verificarVitoriaCPU() {
  let isTrioDeCartasIguais = 0;
  let cartaVerificada = [];
  let repeticoes = 0;
  if (maoCPU.length == 9) {
    for (let i = 0; i < maoCPU.length; i++) {
      if (!cartaVerificada.includes(maoCPU[i])) {
        cartaVerificada.push(maoCPU[i]);
        if (startsWithNumber(maoCPU[i])) {
          repeticoes = verificaRepeticoesArray(maoCPU, maoCPU[i].charAt(0));
          if (repeticoes >= 3) {
            isTrioDeCartasIguais++;
          }
          repeticoes = 0;
        } else if (
          !startsWithNumber(maoCPU[i]) &&
          maoCPU[i].charAt(0) != undefined
        ) {
          switch (maoCPU[i].charAt(0)) {
            case "J":
              repeticoes = verificaRepeticoesArray(maoCPU, "J");
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case "Q":
              repeticoes = verificaRepeticoesArray(maoCPU, "Q");
              if (repeticoes >= 3) {
                isTrioDeCartasIguais++;
              }
              repeticoes = 0;
              break;
            case "K":
              repeticoes = verificaRepeticoesArray(maoCPU, "K");
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
  if (isTrioDeCartasIguais >= 9) return true;
  return false;
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
function verificaSequenciasArray(vetor, valor) {
  let contador = 0;
  let naipe = valor.charAt(1);
  vetor.forEach((v) => v.charAt(0) == valor && contador++);
  return contador;
}

function dragFunction() {
  const dragMaoHumano = document.querySelectorAll(".jogador-humano"); //draggable
  const dragMaoCPU = document.querySelectorAll(".jogador-cpu");
  let dragged;
  if (!vezCPU) {
    dragMaoHumano.forEach((draggable) => {
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
          if(dragged.id!=undefined) {
            if (e.target.className == "jogador-humano") {
              let carta = document.getElementById(e.target.id); //carta a ser removida e substituida
              let carta2 = document.getElementById(dragged.id); //carta sendo movida
              let localCarta = carta.parentNode;
              let localCarta2 = carta2.parentNode;  
              localCarta2.appendChild(carta);
              localCarta.appendChild(carta2);
            }
          };          
        },
        false
      );
    });
  } else {
    dragMaoCPU.forEach((draggable) => {
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
          if(dragged.id!=undefined) {
            if (e.target.className == "jogador-cpu") {
              let carta = document.getElementById(e.target.id); //carta a ser removida e substituida
              let carta2 = document.getElementById(dragged.id); //carta sendo movida
              let localCarta = carta.parentNode;
              let localCarta2 = carta2.parentNode;  
              localCarta2.appendChild(carta);
              localCarta.appendChild(carta2);
            }
          };          
        },
        false
      );
    });
  }
}
