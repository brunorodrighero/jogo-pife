# Pife Game / Jogo Pife

## 🎮 About / Sobre

This is a simplified version of the popular Brazilian card game Pife, built as a web application. In this game, you face off against a computer opponent.

Este é uma versão simplificada do popular jogo de cartas brasileiro Pife, construído como uma aplicação web. Neste jogo, você enfrenta um adversário computadorizado.

## 🚀 Technologies / Tecnologias

This game was developed with the following technologies:

- HTML
- CSS (SCSS)
- JavaScript

Este jogo foi desenvolvido com as seguintes tecnologias:

- HTML
- CSS (SCSS)
- JavaScript

## 📖 How to Play / Como jogar

Pife is a card game where players aim to form sets of three or more cards, either of the same rank (e.g., three 7s) or in a sequence of the same suit (e.g., 4-5-6 of Hearts). The first player to form valid sets with all 9 cards wins.

### Rules:
- Each player starts with 9 cards.
- Players take turns drawing a card from the deck and discarding one.
- Sets must be at least 3 cards (trios or sequences).
- The game ends when a player forms valid sets totaling 9 cards.
- If the deck runs out, a new game starts automatically.

As regras são simples:
- Cada jogador recebe 9 cartas.
- Os jogadores se alternam tirando uma carta do baralho e descartando outra.
- Conjuntos devem ter pelo menos 3 cartas (trios ou sequências).
- O jogo termina quando um jogador forma conjuntos válidos com todas as 9 cartas.
- Se o baralho acabar, um novo jogo é iniciado automaticamente.

## 🔧 Installation / Instalação

Clone the repository and run the game locally:

```bash
git clone https://github.com/brunorodrighero/jogo-pife.git
cd jogo-pife
```

To avoid CORS issues when loading images, use a local server:

1. Install Node.js: [Node.js Download](https://nodejs.org/).
2. Install `live-server`:
   ```bash
   npm install -g live-server
   ```
3. Run the server:
   ```bash
   live-server
   ```
4. Open the provided URL (e.g., `http://localhost:8080`) in your browser.

Alternatively, open `index.html` directly, but note that images may not load due to CORS restrictions.

## 👨‍💻 Contribute / Contribuir

To contribute to the project:

1. Fork this repository.
2. Create a branch for your features:
   ```bash
   git checkout -b my-feature
   ```
3. Commit your improvements:
   ```bash
   git commit -m "Add my feature"
   ```
4. Push your branch:
   ```bash
   git push origin my-feature
   ```
5. Open a Pull Request.

Aqui estão os passos para contribuir:

1. Faça um fork deste repositório.
2. Crie uma branch para suas alterações:
   ```bash
   git checkout -b minha-funcionalidade
   ```
3. Faça commit das suas melhorias:
   ```bash
   git commit -m "Adiciona minha funcionalidade"
   ```
4. Faça push para a sua branch:
   ```bash
   git push origin minha-funcionalidade
   ```
5. Abra um Pull Request.

## 📋 Notes

- Ensure all image files are in the `/imagens/` directory.
- The game requires a modern browser with JavaScript enabled.
- For development, compile SCSS to CSS using a tool like `sass`:
  ```bash
  sass styles.scss styles.css
  ```