class Player {
  constructor(username) {
    this.username = username;
    this.units = new Map(); // equivalent to map[int]Unit
  }
}

const UnitRank = {
  Infantry: "infantry",
  Cavalry: "cavalry",
  Artillery: "artillery",
};

class Unit {
  constructor(id, rank, location) {
    this.id = id;
    this.rank = rank;
    this.location = location;
  }
}

class ArmyMove {
  constructor(player, units, toLocation) {
    this.player = player;
    this.units = units; // equivalent to []Unit
    this.toLocation = toLocation;
  }
}

class RecognitionOfWar {
  constructor(attacker, defender) {
    this.attacker = attacker;
    this.defender = defender;
  }
}

const Location = {
  Americas: "americas",
  Europe: "europe",
  Africa: "africa",
  Asia: "asia",
  Australia: "australia",
  Antarctica: "antarctica",
};

function getAllRanks() {
  return new Set([UnitRank.Infantry, UnitRank.Cavalry, UnitRank.Artillery]);
}

function getAllLocations() {
  return new Set(Object.values(Location));
}

module.exports = {
  Player,
  UnitRank,
  Unit,
  ArmyMove,
  RecognitionOfWar,
  Location,
  getAllRanks,
  getAllLocations,
};
