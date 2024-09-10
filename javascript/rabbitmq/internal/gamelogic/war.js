const WarOutcome = {
  NotInvolved: 0,
  NoUnits: 1,
  YouWon: 2,
  OpponentWon: 3,
  Draw: 4,
};

class GameState {
  constructor(username) {
    this.player = {
      username: username,
      units: new Map(),
    };
    this.paused = false;
  }

  getUnitsSnap() {
    return Array.from(this.player.units.values());
  }

  removeUnitsInLocation(location) {
    this.player.units.forEach((unit, id) => {
      if (unit.location === location) {
        this.player.units.delete(id);
      }
    });
  }

  getPlayerSnap() {
    return this.player;
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

function getOverlappingLocation(p1, p2) {
  for (const unit1 of p1.units) {
    for (const unit2 of p2.units) {
      if (unit1.location === unit2.location) {
        return unit1.location;
      }
    }
  }
  return "";
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

module.exports = {
  WarOutcome,
  GameState,
  getOverlappingLocation,
  unitsToPowerLevel,
};
