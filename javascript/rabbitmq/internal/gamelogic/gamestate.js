const UnitRank = {
  Infantry: "infantry",
  Cavalry: "cavalry",
  Artillery: "artillery",
};

const WarOutcome = {
  NotInvolved: 0,
  NoUnits: 1,
  YouWon: 2,
  OpponentWon: 3,
  Draw: 4,
};

const getAllRanks = () => new Set(Object.values(UnitRank));

const MoveOutcome = {
  SamePlayer: 0,
  Safe: 1,
  MakeWar: 2,
};

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

function unitsToPowerLevel(units) {
  let power = 0;
  units.forEach((unit) => {
    switch (unit.rank) {
      case "artillery":
        power += 10;
        break;
      case "cavalry":
        power += 5;
        break;
      case "infantry":
        power += 1;
        break;
    }
  });
  return power;
}

class GameState {
  constructor(username) {
    this.player = {
      username: username,
      units: new Map(), // equivalent to map[int]Unit
    };
    this.paused = false;
  }

  resumeGame() {
    this.paused = false;
  }

  pauseGame() {
    this.paused = true;
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

  isPaused() {
    return this.paused;
  }

  addUnit(unit) {
    this.player.units.set(unit.id, unit);
  }

  removeUnitsInLocation(location) {
    for (const [id, unit] of this.player.units.entries()) {
      if (unit.location === location) {
        this.player.units.delete(id);
      }
    }
  }

  updateUnit(unit) {
    this.player.units.set(unit.id, unit);
  }

  getUsername() {
    return this.player.username;
  }

  getUnitsSnap() {
    return Array.from(this.player.units.values());
  }

  getUnit(id) {
    const unit = this.player.units.get(id);
    return [unit, unit !== undefined];
  }

  getPlayerSnap() {
    const unitsCopy = new Map(this.player.units);
    return {
      username: this.player.username,
      units: unitsCopy,
    };
  }

  commandStatus() {
    if (this.isPaused()) {
      console.log("The game is paused.");
      return;
    } else {
      console.log("The game is not paused.");
    }

    const player = this.getPlayerSnap();
    console.log(
      `You are ${player.username}, and you have ${player.units.size} units.`
    );
    for (const [id, unit] of player.units.entries()) {
      console.log(`* ${id}: ${unit.location}, ${unit.rank}`);
    }
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
      const [unit] = this.getUnit(unitID);
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

  handleWar(rw) {
    console.log("------------------------");
    console.log();
    console.log("==== War Declared ====");
    console.log(
      `${rw.attacker.username} has declared war on ${rw.defender.username}!`
    );

    const player = this.getPlayerSnap();

    if (player.username === rw.defender.username) {
      console.log(`${player.username}, you published the war.`);
      return [WarOutcome.NotInvolved, "", ""];
    }

    if (player.username !== rw.attacker.username) {
      console.log(`${player.username}, you are not involved in this war.`);
      return [WarOutcome.NotInvolved, "", ""];
    }

    const overlappingLocation = getOverlappingLocation(
      rw.attacker,
      rw.defender
    );
    if (!overlappingLocation) {
      console.log(
        "Error! No units are in the same location. No war will be fought."
      );
      return [WarOutcome.NoUnits, "", ""];
    }

    const attackerUnits = rw.attacker.units.filter(
      (unit) => unit.location === overlappingLocation
    );
    const defenderUnits = rw.defender.units.filter(
      (unit) => unit.location === overlappingLocation
    );

    console.log(`${rw.attacker.username}'s units:`);
    attackerUnits.forEach((unit) => console.log(`  * ${unit.rank}`));

    console.log(`${rw.defender.username}'s units:`);
    defenderUnits.forEach((unit) => console.log(`  * ${unit.rank}`));

    const attackerPower = unitsToPowerLevel(attackerUnits);
    const defenderPower = unitsToPowerLevel(defenderUnits);

    console.log(`Attacker has a power level of ${attackerPower}`);
    console.log(`Defender has a power level of ${defenderPower}`);

    if (attackerPower > defenderPower) {
      console.log(`${rw.attacker.username} has won the war!`);
      if (player.username === rw.defender.username) {
        console.log("You have lost the war!");
        this.removeUnitsInLocation(overlappingLocation);
        console.log(`Your units in ${overlappingLocation} have been killed.`);
        return [
          WarOutcome.OpponentWon,
          rw.attacker.username,
          rw.defender.username,
        ];
      }
      return [WarOutcome.YouWon, rw.attacker.username, rw.defender.username];
    } else if (defenderPower > attackerPower) {
      console.log(`${rw.defender.username} has won the war!`);
      if (player.username === rw.attacker.username) {
        console.log("You have lost the war!");
        this.removeUnitsInLocation(overlappingLocation);
        console.log(`Your units in ${overlappingLocation} have been killed.`);
        return [
          WarOutcome.OpponentWon,
          rw.defender.username,
          rw.attacker.username,
        ];
      }
      return [WarOutcome.YouWon, rw.defender.username, rw.attacker.username];
    }

    console.log("The war ended in a draw!");
    console.log(`Your units in ${overlappingLocation} have been killed.`);
    this.removeUnitsInLocation(overlappingLocation);
    return [WarOutcome.Draw, rw.attacker.username, rw.defender.username];
  }
}

module.exports = GameState;
