const letters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("");
const numbers = "0123456789".split("");

let currentMode = null;
let currentIndex = 0;
let score = 0;

const card = document.getElementById("card");
const lettersBtn = document.getElementById("lettersBtn");
const numbersBtn = document.getElementById("numbersBtn");
const repeatBtn = document.getElementById("repeatBtn");
const scoreDisplay = document.getElementById("score");

// Кнопки
lettersBtn.addEventListener("click", () => startMode("letters"));
numbersBtn.addEventListener("click", () => startMode("numbers"));
repeatBtn.addEventListener("click", repeatItem);

// Начало режима
function startMode(mode) {
  currentMode = mode;
  currentIndex = 0;
  showItem();
}

// Показ карточки
function showItem() {
  const item = currentMode === "letters" ? letters[currentIndex] : numbers[currentIndex];
  card.textContent = item;
  card.style.transform = "scale(0.8)";
  setTimeout(() => card.style.transform = "scale(1)", 100);
  speakItem(item);
  addScore();
  launchConfetti();
}

// Очки
function addScore() {
  score += 1;
  scoreDisplay.textContent = `Очки: ${score}`;
}

// Swipe вверх/вниз
let touchStartY = 0;
let touchEndY = 0;

card.addEventListener('touchstart', e => {
  touchStartY = e.changedTouches[0].screenY;
});

card.addEventListener('touchend', e => {
  touchEndY = e.changedTouches[0].screenY;
  handleGesture();
});

function handleGesture() {
  if (touchStartY - touchEndY > 50) nextItem();
  if (touchEndY - touchStartY > 50) prevItem();
}

// Переключение карточек
function nextItem() {
  if (!currentMode) return;
  currentIndex = (currentIndex + 1) % (currentMode === "letters" ? letters.length : numbers.length);
  showItem();
}

function prevItem() {
  if (!currentMode) return;
  currentIndex = (currentIndex - 1 + (currentMode === "letters" ? letters.length : numbers.length)) %
                  (currentMode === "letters" ? letters.length : numbers.length);
  showItem();
}

function repeatItem() {
  if (!currentMode) return;
  const item = currentMode === "letters" ? letters[currentIndex] : numbers[currentIndex];
  speakItem(item);
}

// Голосовое воспроизведение
function speakItem(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ru-RU";
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

// Подгонка canvas при изменении окна
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
