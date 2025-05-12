# Pife Game / Jogo Pife

## 🎮 About / Sobre

A simple and fun web-based version of the classic Brazilian card game Pife. Play against a computer opponent and try to form winning combinations! This project is built with HTML, CSS (SCSS), and JavaScript, featuring responsive design for various screen sizes.

Uma versão web simples e divertida do clássico jogo de cartas brasileiro Pife. Jogue contra um oponente computadorizado e tente formar combinações vencedoras! Este projeto foi construído com HTML, CSS (SCSS) e JavaScript, e possui design responsivo para diversos tamanhos de tela.

## ✨ Play Online / Jogar Online!

**You can play the game directly in your browser here:**
**Você pode jogar diretamente no seu navegador aqui:**

➡️ **[https://brunorodrighero.github.io/jogo-pife/](https://brunorodrighero.github.io/jogo-pife/)**

## 🚀 Technologies / Tecnologias

This game was developed with the following technologies:
Este jogo foi desenvolvido com as seguintes tecnologias:

- HTML5
- CSS3 (SCSS for development)
- JavaScript (ES6+)

## 📖 How to Play / Como Jogar

Pife is a card game where the objective is to be the first to form valid sets (melds) with all 9 cards in your hand. Valid melds are either three or more cards of the same rank (e.g., three 7s) or a sequence of three or more consecutive cards of the same suit (e.g., 4-5-6 of Hearts).

O Pife é um jogo de cartas onde o objetivo é ser o primeiro a formar jogos válidos com todas as 9 cartas da sua mão. Jogos válidos são trincas (ou mais cartas do mesmo valor, ex: três 7s) ou sequências (três ou mais cartas consecutivas do mesmo naipe, ex: 4-5-6 de Copas).

### Objective / Objetivo:
- Form melds (sets or sequences) with all 9 cards in your hand after discarding your 10th card.
- Formar jogos (trincas ou sequências) com todas as 9 cartas da sua mão após descartar sua 10ª carta.

### Gameplay Actions / Ações no Jogo:

1.  **Starting the Game / Iniciando o Jogo:**
    * A new game starts automatically when the page loads.
    * Click the **"Novo Jogo"** button at any time to start a fresh game.
    * *Um novo jogo começa automaticamente ao carregar a página.*
    * *Clique no botão **"Novo Jogo"** a qualquer momento para iniciar uma nova partida.*

2.  **Your Turn (Draw or Take) / Sua Vez (Comprar ou Pegar):**
    * When it's your turn (indicated by "Sua Vez (Comprar ou Pegar)"), you must either:
        * **Draw from Deck:** Click the face-down deck of cards (image of card backs) on the table.
        * **Take from Discard:** Click the face-up card on the discard pile (if available).
    * *Quando for sua vez (indicado por "Sua Vez (Comprar ou Pegar)"), você deve:*
        * ***Comprar do Monte:*** *Clique no monte de cartas virado para baixo na mesa.*
        * ***Pegar do Lixo:*** *Clique na carta virada para cima na pilha de descarte (se houver).*

3.  **Your Turn (Discard) / Sua Vez (Descartar):**
    * After drawing or taking a card, you will have 10 cards in your hand.
    * The game will indicate "Sua Vez (Descartar)".
    * Click on one card **from your hand** to discard it to the discard pile.
    * *Após comprar ou pegar uma carta, você terá 10 cartas na sua mão.*
    * *O jogo indicará "Sua Vez (Descartar)".*
    * *Clique em uma carta **da sua mão** para descartá-la na pilha de descarte.*

4.  **Organizing Your Hand / Organizando Sua Mão:**
    * You can rearrange the cards in your hand by clicking and dragging them to the desired position within your hand area.
    * *Você pode reorganizar as cartas na sua mão clicando e arrastando-as para a posição desejada dentro da sua área de mão.*

5.  **Winning ("Bater") / Vitória ("Bater"):**
    * The game automatically checks for a win condition after you discard a card (leaving you with 9 cards).
    * If your 9 cards form valid melds (e.g., three sets of three, or a set of three and a sequence of six, etc.), you win the round!
    * *O jogo verifica automaticamente a condição de vitória após você descartar uma carta (ficando com 9 cartas).*
    * *Se suas 9 cartas formarem jogos válidos (ex: três trincas, ou uma trinca e uma sequência de seis, etc.), você vence a rodada!*

6.  **Game Buttons / Botões do Jogo:**
    * **"Nova Carta":** Same as clicking the deck to draw a card (only works when it's your turn to draw/take).
    * **"Novo Jogo":** Starts a completely new game.
    * **"Como Jogar?":** Opens a pop-up window with these game instructions.
    * **"Mostrar/Esconder CPU":** Toggles the visibility of the CPU opponent's cards. By default, they are hidden.
    * ***"Nova Carta":*** *Mesma ação que clicar no monte para comprar uma carta (só funciona na sua vez de comprar/pegar).*
    * ***"Novo Jogo":*** *Inicia um jogo completamente novo.*
    * ***"Como Jogar?":*** *Abre uma janela pop-up com estas instruções do jogo.*
    * ***"Mostrar/Esconder CPU":*** *Alterna a visibilidade das cartas do oponente CPU. Por padrão, elas ficam escondidas.*

### Basic Rules of Pife / Regras Básicas do Pife:
- Each player starts with 9 cards.
- The goal is to form melds (sets or runs) with your 9 cards.
    - **Set (Trinca/Quadra):** 3 or 4 cards of the same rank (e.g., 7♣, 7♦, 7♠).
    - **Run/Sequence (Sequência):** 3 or more consecutive cards of the same suit (e.g., 4♥, 5♥, 6♥). The Ace ('A') is typically low (A-2-3).
- If the deck runs out of cards, the game usually ends or the discard pile is reshuffled (in this version, it might restart or end – check gameplay).

- *Cada jogador começa com 9 cartas.*
- *O objetivo é formar jogos (trincas/quadras ou sequências) com suas 9 cartas.*
    - ***Trinca/Quadra:*** *3 ou 4 cartas do mesmo valor (ex: 7♣, 7♦, 7♠).*
    - ***Sequência:*** *3 ou mais cartas consecutivas do mesmo naipe (ex: 4♥, 5♥, 6♥). O Ás ('A') é tipicamente baixo (A-2-3).*
- *Se o baralho acabar, o jogo geralmente termina ou a pilha de descarte é reembaralhada (nesta versão, pode reiniciar ou terminar – verifique no jogo).*

## 🔧 Installation (For Local Development) / Instalação (Para Desenvolvimento Local)

If you want to run the game locally or contribute to its development:
Se você quiser rodar o jogo localmente ou contribuir para o desenvolvimento:

1.  **Clone the repository / Clone o repositório:**
    ```bash
    git clone [https://github.com/brunorodrighero/jogo-pife.git](https://github.com/brunorodrighero/jogo-pife.git)
    cd jogo-pife
    ```
2.  **Serve the files / Sirva os arquivos:**
    * To avoid potential CORS issues (especially with image loading if you're modifying paths), it's recommended to use a local server.
    * If you have Node.js installed, you can use `live-server`:
        ```bash
        npm install -g live-server
        live-server
        ```
    * Then open the URL provided by `live-server` (e.g., `http://127.0.0.1:8080`) in your browser.
    * *Para evitar possíveis problemas de CORS (especialmente com o carregamento de imagens se você estiver modificando caminhos), é recomendado usar um servidor local.*
    * *Se você tem Node.js instalado, pode usar o `live-server`:*
        ```bash
        npm install -g live-server
        live-server
        ```
    * *Então abra a URL fornecida pelo `live-server` (ex: `http://127.0.0.1:8080`) no seu navegador.*
3.  **Alternative / Alternativa:**
    * You can also open the `index.html` file directly in your browser, but be aware that some functionalities or asset loading might behave differently without a server.
    * *Você também pode abrir o arquivo `index.html` diretamente no seu navegador, mas esteja ciente de que algumas funcionalidades ou o carregamento de assets podem se comportar de forma diferente sem um servidor.*

## 👨‍💻 Contribute / Contribuir

Contributions are welcome! If you'd like to improve the game or add new features:
Contribuições são bem-vindas! Se você gostaria de melhorar o jogo ou adicionar novas funcionalidades:

1.  Fork this repository. / Faça um fork deste repositório.
2.  Create a branch for your feature: (`git checkout -b feature/AmazingFeature`) / Crie uma branch para sua funcionalidade: (`git checkout -b feature/FuncionalidadeIncrivel`)
3.  Commit your changes: (`git commit -m 'Add some AmazingFeature'`) / Faça commit das suas alterações: (`git commit -m 'Adiciona alguma FuncionalidadeIncrivel'`)
4.  Push to the branch: (`git push origin feature/AmazingFeature`) / Faça push para a branch: (`git push origin feature/FuncionalidadeIncrivel`)
5.  Open a Pull Request. / Abra um Pull Request.

## 📋 Notes / Notas Adicionais

- Ensure all image files are correctly placed in the `/imagens/` directory and favicon assets in `/extra-assets/`.
- The game requires a modern web browser with JavaScript enabled.
- For development, if you modify `styles.scss`, remember to compile it to `styles.css`. You can use a Sass compiler for this:
  ```bash
  sass styles.scss styles.css --watch