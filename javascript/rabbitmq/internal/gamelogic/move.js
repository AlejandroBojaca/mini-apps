const MoveOutcome = {
  SamePlayer: 0,
  Safe: 1,
  MakeWar: 2,
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

  getPlayerSnap() {
    return {
      username: this.player.username,
      units: new Map(this.player.units),
    };
  }

  getUnit(id) {
    const unit = this.player.units.get(id);
    return unit ? { ...unit } : null;
  }

  updateUnit(unit) {
    this.player.units.set(unit.id, unit);
  }

  handleMove(move) {
    console.log("------------------------");
    const player = this.getPlayerSnap();

    console.log();
    console.log("==== Move Detected ====");
    console.log(
      `${move.player.username} is moving ${move.units.length} unit(s) to ${move.toLocation}`
    );
    move.units.forEach((unit) => console.log(`* ${unit.rank}`));

    if (player.username === move.player.username) {
      return MoveOutcome.SamePlayer;
    }

    const overlappingLocation = this.getOverlappingLocation(
      player,
      move.player
    );
    if (overlappingLocation) {
      console.log(
        `You have units in ${overlappingLocation}! You are at war with ${move.player.username}!`
      );
      return MoveOutcome.MakeWar;
    }
    console.log(`You are safe from ${move.player.username}'s units.`);
    return MoveOutcome.Safe;
  }

  getOverlappingLocation(p1, p2) {
    for (let u1 of p1.units.values()) {
      for (let u2 of p2.units.values()) {
        if (u1.location === u2.location) {
          return u1.location;
        }
      }
    }
    return null;
  }

  commandMove(words) {
    if (this.isPaused()) {
      throw new Error("The game is paused, you cannot move units");
    }
    if (words.length < 3) {
      throw new Error("Usage: move <location> <unitID> <unitID> <unitID> etc");
    }

    const newLocation = words[1];
    const locations = getAllLocations();
    if (!locations.has(newLocation)) {
      throw new Error(`Error: ${newLocation} is not a valid location`);
    }

    const unitIDs = words.slice(2).map((word) => {
      const unitID = parseInt(word, 10);
      if (isNaN(unitID)) {
        throw new Error(`Error: ${word} is not a valid unit ID`);
      }
      return unitID;
    });

    for (const unitID of unitIDs) {
      const unit = this.getUnit(unitID);
      if (!unit) {
        throw new Error(`Error: unit with ID ${unitID} not found`);
      }
      unit.location = newLocation;
      this.updateUnit(unit);
    }

    const move = {
      toLocation: newLocation,
      units: Array.from(this.player.units.values()),
      player: this.getPlayerSnap(),
    };
    console.log(`Moved ${move.units.length} units to ${move.toLocation}`);
    return move;
  }
}

function getAllLocations() {
  return new Set([
    "americas",
    "europe",
    "africa",
    "asia",
    "australia",
    "antarctica",
  ]);
}

module.exports = { MoveOutcome, GameState, getAllLocations };
