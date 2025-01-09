const socket = io("ws://localhost:3000");
const submit = document.getElementById("submit");
const message = document.getElementById("message");
const chatBox = document.getElementById("chat-box");

const username = prompt("Write your username", "Nobody") || "Default";

submit.addEventListener("click", () => {
  const messageContent = message.value;
  if (messageContent.trim()) {
    socket.emit("message", { username, message: messageContent });
    message.value = "";
  }
});

socket.on("message", ({ username, message }) => {
  chatBox.innerHTML += `<h2>${username}: ${message}</h2>`;
});
