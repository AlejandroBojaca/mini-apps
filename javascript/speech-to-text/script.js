const read = document.getElementById("read");
const text = document.getElementById("text");

read.addEventListener("click", () => {
  let utterance = new SpeechSynthesisUtterance(text.value);
  speechSynthesis.speak(utterance);
});
