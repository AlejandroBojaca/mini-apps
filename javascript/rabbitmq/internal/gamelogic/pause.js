const routing = {
  PlayingState: class {
    constructor(isPaused) {
      this.isPaused = isPaused;
    }
  },
};

class GameState {
  constructor(username) {
    this.player = {
      username: username,
      units: new Map(),
    };
    this.paused = false;
  }

  isPaused() {
    return this.paused;
  }

  pauseGame() {
    this.paused = true;
  }

  resumeGame() {
    this.paused = false;
  }

  handlePause(ps) {
    console.log("------------------------");
    console.log();
    if (ps.isPaused) {
      console.log("==== Pause Detected ====");
      this.pauseGame();
    } else {
      console.log("==== Resume Detected ====");
      this.resumeGame();
    }
  }
}

module.exports = { routing, GameState };
