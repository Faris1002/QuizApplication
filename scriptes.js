const questions = {
  easy: [
    { q: "Which animal says 'moo'?", options: ["Dog", "Cat", "Cow", "Sheep"], answer: 2 },
    { q: "What color is the sky?", options: ["Red", "Blue", "Green", "Yellow"], answer: 1 },
    { q: "How many legs does a spider have?", options: ["4", "6", "8", "10"], answer: 2 },
    { q: "Which is a fruit?", options: ["Carrot", "Potato", "Apple", "Onion"], answer: 2 },
    { q: "Sun rises in the?", options: ["North", "South", "East", "West"], answer: 2 }
  ],
  medium: [
    { q: "HTML stands for?", options: ["HighText Machine Language", "HyperText Markup Language", "HyperTool Multi Language", "None"], answer: 1 },
    { q: "Which is not a programming language?", options: ["Python", "HTML", "C++", "Java"], answer: 1 },
    { q: "Which company developed Java?", options: ["Microsoft", "Sun Microsystems", "Google", "Apple"], answer: 1 },
    { q: "Which tag is used for line breaks?", options: ["<br>", "<break>", "<lb>", "<ln>"], answer: 0 },
    { q: "What is CSS used for?", options: ["Structure", "Database", "Styling", "Logic"], answer: 2 }
  ],
  hard: [
    { q: "Time complexity of binary search?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], answer: 2 },
    { q: "Which is NOT a NoSQL DB?", options: ["MongoDB", "Firebase", "MySQL", "Cassandra"], answer: 2 },
    { q: "Which is used for ML?", options: ["TensorFlow", "MongoDB", "Postman", "Docker"], answer: 0 },
    { q: "JS engine in Chrome?", options: ["V8", "SpiderMonkey", "Rhino", "Nashorn"], answer: 0 },
    { q: "What is an API?", options: ["Application Programming Interface", "Apple Pie Inside", "Applied Protocol Interface", "App Performance Interface"], answer: 0 }
  ]
};

let selectedDifficulty = null;
let currentQ = 0;
let score = 0;
let currentSet = [];
let timerInterval;
let timeLeft = 90;

let startScreen = document.getElementById("start-screen");
let quizScreen = document.getElementById("quiz-screen");
let resultScreen = document.getElementById("result-screen");
let startBtn = document.getElementById("start-btn");
let progressFill = document.getElementById("progress-fill");
let questionText = document.getElementById("question-text");
let questionhm = document.getElementById("question-hm");
let optionsDiv = document.getElementById("options");
let scoreDisplay = document.getElementById("score");
let percentageDisplay = document.getElementById("percentage");
let difficultyDisplay = document.getElementById("difficulty-level");
let saveBtn = document.getElementById("save-score-btn");
let usernameInput = document.getElementById("username");
let levelName = document.getElementById("level-name");
let timerDisplay = document.getElementById("timer");

document.querySelectorAll(".difficulty-buttons .btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedDifficulty = btn.dataset.difficulty;
    startBtn.disabled = false;
  });
});

startBtn.addEventListener("click", () => {
  currentSet = questions[selectedDifficulty];
  levelName.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  startTimer();
  loadQuestion();
});

function startTimer() {
  timeLeft = 90;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}

function updateTimerDisplay() {
  let minute=Number.parseInt(timeLeft / 60);
  let second=Number.parseInt(timeLeft % 60);
  minute=(minute<10)?`0${minute}`:minute;
  second=(second<10)?`0${second}`:second;
  timerDisplay.textContent=`${minute}:${second}`;
}

function loadQuestion() {
  let qObj = currentSet[currentQ];
  questionhm.textContent = `Question ${currentQ + 1} of ${currentSet.length}`;
  questionText.textContent = qObj.q;
  optionsDiv.innerHTML = "";
  qObj.options.forEach((opt, idx) => {
    let btn = document.createElement("button");
    btn.textContent = String.fromCharCode(65 + idx) + ". " + opt;
    btn.onclick = () => handleAnswer(idx);
    optionsDiv.appendChild(btn);
  });
  progressFill.style.width = `${(currentQ / currentSet.length) * 100}%`;
}

function handleAnswer(selected) {
  if (selected === currentSet[currentQ].answer) score++;
  currentQ++;
  if (currentQ < currentSet.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    showResult();
  }
}

function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  let percent = Math.round((score / currentSet.length) * 100);
  scoreDisplay.textContent = `${score} / ${currentSet.length}`;
  percentageDisplay.textContent = percent;
  difficultyDisplay.textContent = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
}

saveBtn.addEventListener("click", () => {
  let name = usernameInput.value.trim();
  if (!name) return;
  let highscores = JSON.parse(localStorage.getItem("highscores") || "[]");
  highscores.push({ name, score, difficulty: selectedDifficulty });
  highscores.sort((a, b) => b.score - a.score);
  localStorage.setItem("highscores", JSON.stringify(highscores.slice(0, 5)));
  alert("High score saved!");
});

function viewHighScores() {
  let highscores = JSON.parse(localStorage.getItem("highscores") || "[]");
  let list = highscores.map(s => `${s.name} - ${s.score} (${s.difficulty})`).join("\n");
  alert("High Scores:\n" + list);
}
