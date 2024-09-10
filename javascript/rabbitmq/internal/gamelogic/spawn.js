const UnitRank = {
  Infantry: "infantry",
  Cavalry: "cavalry",
  Artillery: "artillery",
};

const getAllRanks = () => new Set(Object.values(UnitRank));

const Location = {
  Americas: "americas",
  Europe: "europe",
  Africa: "africa",
  Asia: "asia",
  Australia: "australia",
  Antarctica: "antarctica",
};

const getAllLocations = () => new Set(Object.values(Location));

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

  getUnitsSnap() {
    return Array.from(this.player.units.values());
  }

  addUnit(unit) {
    this.player.units.set(unit.id, unit);
  }

  commandSpawn(words) {
    if (words.length < 3) {
      throw new Error("Usage: spawn <location> <rank>");
    }

    const locationName = words[1];
    if (!getAllLocations().has(locationName)) {
      throw new Error(`Error: ${locationName} is not a valid location`);
    }

    const rank = words[2];
    if (!getAllRanks().has(rank)) {
      throw new Error(`Error: ${rank} is not a valid unit`);
    }

    const id = this.getUnitsSnap().length + 1;
    const unit = {
      id: id,
      rank: rank,
      location: locationName,
    };
    this.addUnit(unit);

    console.log(`Spawned a(n) ${rank} in ${locationName} with id ${id}`);
  }
}

module.exports = {
  UnitRank,
  getAllRanks,
  Location,
  getAllLocations,
  GameState,
};
