// routing.js

class PlayingState {
  constructor(isPaused) {
    this.isPaused = isPaused;
  }

  changeState(state = false) {
    this.isPaused = state;
  }
}

class GameLog {
  constructor(currentTime, message, username) {
    this.currentTime = currentTime;
    this.message = message;
    this.username = username;
  }
}

module.exports = { PlayingState, GameLog };
