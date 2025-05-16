// Перевод
const translations = {
  en: {
    title: "Tic-Tac-Toe",
    play: "Play",
    settings: "Settings",
    chooseSymbol: "Choose your symbol:",
    chooseDifficulty: "Choose difficulty:",
    easy: "Easy",
    medium: "Medium",
    back: "Back",
    startGame: "Start Game",
    yourTurn: "Your turn (X)",
    aiTurn: "AI is thinking...",
    playerWins: "You win!",
    aiWins: "AI wins!",
    draw: "It's a draw!",
    playAgain: "Play Again",
    mainMenu: "Main Menu"
  },
  ru: {
    title: "Крестики-нолики",
    play: "Играть",
    settings: "Настройки",
    chooseSymbol: "Выберите ваш символ:",
    chooseDifficulty: "Выберите сложность:",
    easy: "Легкая",
    medium: "Средняя",
    back: "Назад",
    startGame: "Начать игру",
    yourTurn: "Ваш ход (X)",
    aiTurn: "ИИ думает...",
    playerWins: "Вы победили!",
    aiWins: "ИИ победил!",
    draw: "Ничья!",
    playAgain: "Играть снова",
    mainMenu: "Главное меню"
  }
};

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let playerSymbol = 'X';
let aiSymbol = 'O';
let difficulty = 'easy';
let currentLang = 'en';

const menu = document.querySelector('.menu');
const settings = document.querySelector('.settings');
const game = document.querySelector('.game');
const boardEl = document.getElementById('board');
const statusEl = document.querySelector('.status');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const langButtons = document.querySelectorAll('.lang-btn');

// Инициализация игры
createBoard();
updateTranslations();
setActiveLangButton();

// Выбор языка
langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    updateTranslations();
    setActiveLangButton();
  });
});

function setActiveLangButton() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Обновить весь перевод
function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = translations[currentLang][key];
  });
  
  // Обновить язык для настроек сложности
  if (currentLang === 'ru') {
    document.getElementById('difficulty').options[0].text = 'Легкая';
    document.getElementById('difficulty').options[1].text = 'Средняя';
  } else {
    document.getElementById('difficulty').options[0].text = 'Easy';
    document.getElementById('difficulty').options[1].text = 'Medium';
  }
  
  // Обновить статус, если игра активна
  if (gameActive) {
    updateStatus();
  }
}

document.getElementById('playBtn').addEventListener('click', () => {
  startGame();
});

document.getElementById('settingsBtn').addEventListener('click', () => {
  menu.classList.add('hidden');
  settings.classList.remove('hidden');
});

document.getElementById('backBtn').addEventListener('click', () => {
  settings.classList.add('hidden');
  menu.classList.remove('hidden');
});

document.getElementById('startGameBtn').addEventListener('click', () => {
  playerSymbol = document.getElementById('playerSymbol').value;
  aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
  difficulty = document.getElementById('difficulty').value;
  settings.classList.add('hidden');
  startGame();
});

document.getElementById('mainMenuBtn').addEventListener('click', () => {
  game.classList.add('hidden');
  menu.classList.remove('hidden');
  resetGame();
});

document.getElementById('playAgainBtn').addEventListener('click', () => {
  modal.classList.add('hidden');
  resetGame();
  startGame();
});

document.getElementById('modalMenuBtn').addEventListener('click', () => {
  modal.classList.add('hidden');
  game.classList.add('hidden');
  menu.classList.remove('hidden');
  resetGame();
});

// Инициализация поля
function createBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.setAttribute('data-index', i);
    const span = document.createElement('span');
    cell.appendChild(span);
    cell.addEventListener('click', handleCellClick);
    boardEl.appendChild(cell);
  }
}

// Начать новую игру
function startGame() {
  resetGame();
  gameActive = true;
  currentPlayer = 'X'; // X всегда ходит первым
  menu.classList.add('hidden');
  game.classList.remove('hidden');
  updateStatus();
  
  // Если ИИ ходит первым (когда игрок выбрал 'O')
  if (playerSymbol === 'O' && currentPlayer === 'X') {
    currentPlayer = 'X'; // ИИ всегда 'X' когда игрок 'O'
    setTimeout(makeAIMove, 500); // небольшая задержка для визуального эффекта
  }
}

// Сбросить статус игры
function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  const cells = document.querySelectorAll('.board div');
  cells.forEach(cell => {
    const span = cell.querySelector('span');
    span.textContent = '';
    span.style.animation = '';
    cell.style.backgroundColor = '';
    cell.classList.remove('winning-cell');
  });
}

function handleCellClick(e) {
  if (!gameActive) return;
  
  const index = e.target.getAttribute('data-index');
  const span = e.target.querySelector('span');
  
  // Если клетка пуста и это ход игрока
  if (board[index] === '' && currentPlayer === playerSymbol) {
    board[index] = playerSymbol;
    span.textContent = playerSymbol;
    span.style.color = playerSymbol === 'X' ? 'var(--x-color)' : 'var(--o-color)';
    span.style.animation = 'cellPop 0.3s';
    
    setTimeout(() => {
      span.style.animation = '';
    }, 300);
    
    if (checkWin(playerSymbol)) {
      endGame(playerSymbol);
      return;
    }
    
    if (checkDraw()) {
      endGame(null);
      return;
    }
    
    currentPlayer = aiSymbol;
    updateStatus();
    setTimeout(makeAIMove, 500);
  }
}

// ИИ делает ход
function makeAIMove() {
  if (!gameActive || currentPlayer !== aiSymbol) return;
  
  let move;
  
  if (difficulty === 'easy') {
    // Легкий ИИ - случайный ход
    const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    if (emptyCells.length > 0) {
      move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  } else {
    // Средний ИИ - пытается выиграть или блокировать
    move = findWinningMove(aiSymbol) || findWinningMove(playerSymbol) || findRandomMove();
  }
  
  if (move !== undefined && move !== null) {
    board[move] = aiSymbol;
    const cell = document.querySelector(`.board div[data-index="${move}"]`);
    const span = cell.querySelector('span');
    span.textContent = aiSymbol;
    span.style.color = aiSymbol === 'X' ? 'var(--x-color)' : 'var(--o-color)';
    span.style.animation = 'cellPop 0.3s';
    
    setTimeout(() => {
      span.style.animation = '';
    }, 300);
    
    if (checkWin(aiSymbol)) {
      endGame(aiSymbol);
      return;
    }
    
    if (checkDraw()) {
      endGame(null);
      return;
    }
    
    currentPlayer = playerSymbol;
    updateStatus();
  }
}

// Нахождение выигрышного хода для данного символа
function findWinningMove(symbol) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6] 
  ];
  
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] === symbol && board[b] === symbol && board[c] === '') return c;
    if (board[a] === symbol && board[c] === symbol && board[b] === '') return b;
    if (board[b] === symbol && board[c] === symbol && board[a] === '') return a;
  }
  
  return null;
}

// Найти случайную пустую клетку
function findRandomMove() {
  const emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Проверка если текущий игрок победил
function checkWin(symbol) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6] 
  ];
  
  const winningLine = lines.find(line => {
    return line.every(index => {
      return board[index] === symbol;
    });
  });
  
  if (winningLine) {
    winningLine.forEach(index => {
      document.querySelector(`.board div[data-index="${index}"]`).classList.add('winning-cell');
    });
    return true;
  }
  
  return false;
}

// Проверка на ничью
function checkDraw() {
  return board.every(cell => cell !== '');
}

// Конец игры
function endGame(winner) {
  gameActive = false;
  
  if (winner) {
    modalTitle.setAttribute('data-i18n', winner === playerSymbol ? 'playerWins' : 'aiWins');
    modalTitle.textContent = translations[currentLang][winner === playerSymbol ? 'playerWins' : 'aiWins'];
  } else {
    modalTitle.setAttribute('data-i18n', 'draw');
    modalTitle.textContent = translations[currentLang]['draw'];
  }
  
  modal.classList.remove('hidden');
}

// Обновить сообщение статуса
function updateStatus() {
  if (currentPlayer === playerSymbol) {
    statusEl.setAttribute('data-i18n', 'yourTurn');
    statusEl.textContent = `${translations[currentLang]['yourTurn'].replace('(X)', `(${playerSymbol})`)}`;
  } else {
    statusEl.setAttribute('data-i18n', 'aiTurn');
    statusEl.textContent = translations[currentLang]['aiTurn'];
  }
}
