const video = document.getElementById("video");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const stopButton = document.getElementById("stop");
const progress = document.getElementById("progress");
const timestamp = document.getElementById("timestamp");

video.addEventListener("click", tooglePause);
video.addEventListener("timeupdate", updateBar);
playButton.addEventListener("click", tooglePause);
pauseButton.addEventListener("click", tooglePause);
stopButton.addEventListener("click", stopVideo);
progress.addEventListener("change", setTime);

function tooglePause(_) {
  video.paused ? video.play() : video.pause();
  playButton.classList.toggle("hidden");
  pauseButton.classList.toggle("hidden");
}

function stopVideo(_) {
  video.currentTime = 0;
  video.pause();
}

function setTime(_) {
  video.currentTime = (+progress.value * video.duration) / 100;
}

function updateBar(_) {
  const curTime = video.currentTime;
  const minutes = Math.floor(curTime / 60);
  const seconds = Math.floor(curTime % 60);

  timestamp.innerHTML = `${minutes > 9 ? minutes : "0" + minutes}:${
    seconds > 9 ? seconds : "0" + seconds
  }`;

  progress.value = (+seconds * 100) / video.duration;
  if (video.duration === video.currentTime) {
    video.pause();
    playButton.classList.toggle("hidden");
    pauseButton.classList.toggle("hidden");
  }
}
