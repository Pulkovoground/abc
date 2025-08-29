const letters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
const numbers = "0123456789".split("");

let currentMode = null;
let currentIndex = 0;
let score = 0;
let checked = false; // состояние — проверил или нет

const card = document.getElementById("card");
const lettersBtn = document.getElementById("lettersBtn");
const numbersBtn = document.getElementById("numbersBtn");
const checkBtn = document.getElementById("checkBtn");
const scoreDisplay = document.getElementById("score");

lettersBtn.addEventListener("click", () => startMode("letters"));
numbersBtn.addEventListener("click", () => startMode("numbers"));
checkBtn.addEventListener("click", handleCheck);

// -------------------
// Режимы
// -------------------
function startMode(mode) {
  currentMode = mode;
  currentIndex = 0;
  checked = false;
  showItem();
  checkBtn.textContent = "Проверить";
}

// Показ карточки
function showItem() {
  const item = currentMode === "letters" ? letters[currentIndex] : numbers[currentIndex];
  card.textContent = item;
  card.style.transform = "scale(0.8)";
  setTimeout(() => card.style.transform = "scale(1)", 100);
  checked = false;
  checkBtn.textContent = "Проверить";
}

// -------------------
// Кнопка "Проверить" → "Следующая"
// -------------------
function handleCheck() {
  if (!currentMode) return;

  if (!checked) {
    // Проверка — включить озвучку
    const item = currentMode === "letters" ? letters[currentIndex] : numbers[currentIndex];
    const prefix = currentMode === "letters" ? "Буква " : "Цифра ";
    speakItem(prefix + item);

    addScore();
    launchConfetti();

    checked = true;
    checkBtn.textContent = "Следующая";
  } else {
    // Следующая карточка
    nextItem();
  }
}

// Следующая карточка
function nextItem() {
  currentIndex = (currentIndex + 1) % (currentMode === "letters" ? letters.length : numbers.length);
  showItem();
}

// -------------------
// Очки
// -------------------
function addScore() {
  score += 1;
  scoreDisplay.textContent = `Очки: ${score}`;
}

// -------------------
// Голосовое воспроизведение
// -------------------
function speakItem(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ru-RU";
  speechSynthesis.cancel(); // сброс, чтобы не накладывалось
  speechSynthesis.speak(utterance);
}

// -------------------
// Конфетти
// -------------------
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Confetti {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 10 + 5;
    this.speedY = Math.random() * 5 + 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }
  update() { this.y += this.speedY; }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

let confettiParticles = [];

function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    confettiParticles.push(new Confetti());
  }
}

function animateConfetti() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confettiParticles.forEach((c, i) => {
    c.update();
    c.draw();
    if (c.y > canvas.height) confettiParticles.splice(i,1);
  });
  requestAnimationFrame(animateConfetti);
}
animateConfetti();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
