//TODO Add wrong letters
const figureParts = document.querySelectorAll(".figure-part");
const wrongLetters = document.getElementById("wrong-letters");
const popup = document.getElementById("popup-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById(
  "final-message-reveal-word"
);
const notificationContainer = document.getElementById("notification-container");
const playAgainButton = document.getElementById("play-button");
const word = document.getElementById("word");

const words = ["hello", "bye"];
let selectedWord = words[Math.floor(Math.random() * words.length)];
let playable = true;
let keySet = new Set();
let partIndex = 0;
let correctLetters = [];

playAgainButton.addEventListener("click", resetGame);
document.addEventListener("keyup", (e) => {
  if (!playable) return;
  const key = e.code.startsWith("Key")
    ? e.code[e.code.length - 1].toLowerCase()
    : null;

  if (key) {
    if (keySet.has(key)) {
      alertRepeatedLetter();
      return;
    }
    keySet.add(key);
  }

  if (key && selectedWord.includes(key)) {
    addCorrectLetter(key);
  }

  if (key && !selectedWord.includes(key)) {
    renderPart();
  }
});

function resetGame() {
  popup.style.display = "none";
  playable = true;
  partIndex = 0;
  keySet = new Set();
  selectedWord = words[Math.floor(Math.random() * words.length)];
  figureParts.forEach((figure) => {
    figure.classList.add("figure-part");
  });
  correctLetters = [];
  displayWord();
}

function displayWord() {
  word.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ""}
          </span>
        `
      )
      .join("")}
  `;

  const innerWord = word.innerText.replace(/[ \n]/g, "");

  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    finalMessageRevealWord.innerText = "";
    popup.style.display = "flex";

    playable = false;
  }
}

function renderPart() {
  figureParts[partIndex].classList.remove("figure-part");
  partIndex += 1;
  if (partIndex > figureParts.length - 1) {
    alertLoss();
  }
}

function addCorrectLetter(letter) {
  correctLetters.push(letter);
  displayWord();
}

function alertRepeatedLetter() {
  notificationContainer.classList.toggle("show");
  setTimeout(() => notificationContainer.classList.toggle("show"), 2500);
}

function alertLoss() {
  playable = false;
  popup.style.display = "flex";
}

displayWord();
