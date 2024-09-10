const { Mutex } = require("async-mutex");

class GameState {
  constructor(username) {
    this.player = {
      username: username,
      units: new Map(), // equivalent to map[int]Unit
    };
    this.paused = false;
    this.mutex = new Mutex(); // equivalent to sync.RWMutex
  }

  async resumeGame() {
    const release = await this.mutex.acquire();
    try {
      this.paused = false;
    } finally {
      release();
    }
  }

  async pauseGame() {
    const release = await this.mutex.acquire();
    try {
      this.paused = true;
    } finally {
      release();
    }
  }

  async isPaused() {
    const release = await this.mutex.acquire();
    try {
      return this.paused;
    } finally {
      release();
    }
  }

  async addUnit(unit) {
    const release = await this.mutex.acquire();
    try {
      this.player.units.set(unit.id, unit);
    } finally {
      release();
    }
  }

  async removeUnitsInLocation(location) {
    const release = await this.mutex.acquire();
    try {
      for (const [id, unit] of this.player.units.entries()) {
        if (unit.location === location) {
          this.player.units.delete(id);
        }
      }
    } finally {
      release();
    }
  }

  async updateUnit(unit) {
    const release = await this.mutex.acquire();
    try {
      this.player.units.set(unit.id, unit);
    } finally {
      release();
    }
  }

  getUsername() {
    return this.player.username;
  }

  async getUnitsSnap() {
    const release = await this.mutex.acquire();
    try {
      return Array.from(this.player.units.values());
    } finally {
      release();
    }
  }

  async getUnit(id) {
    const release = await this.mutex.acquire();
    try {
      const unit = this.player.units.get(id);
      return [unit, unit !== undefined];
    } finally {
      release();
    }
  }

  async getPlayerSnap() {
    const release = await this.mutex.acquire();
    try {
      const unitsCopy = new Map(this.player.units);
      return {
        username: this.player.username,
        units: unitsCopy,
      };
    } finally {
      release();
    }
  }
}

module.exports = GameState;
