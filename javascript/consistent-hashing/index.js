const crypto = require("node:crypto");

class ConsistentHashing {
  constructor(n = 3) {
    this.numberOfReplicas = n;
    this.ring = new Map(); // (hash, nodeKey)
    this.sortedHashes = [];
  }

  _hash(key) {
    return parseInt(
      crypto.createHash("md5").update(key).digest("hex").substring(0, 8),
      16
    );
  }

  addNode(node) {
    for (let i = 0; i < this.numberOfReplicas; i++) {
      const hashKey = `${node}_${i}`;
      const hash = this._hash(hashKey);

      // Handle collisions (if needed)
      while (this.ring.has(hash)) {
        hash = this._hash(`${hashKey}_${Math.random()}`);
      }

      this.ring.set(hash, node);

      // Binary insertion into sortedHashes
      const index = this.sortedHashes.findIndex((h) => h > hash);
      if (index === -1) {
        this.sortedHashes.push(hash);
      } else {
        this.sortedHashes.splice(index, 0, hash);
      }
    }
  }

  getNode(key) {
    const hash = this._hash(key);

    // Handle wrap-around case
    if (hash > this.sortedHashes[this.sortedHashes.length - 1]) {
      return this.ring.get(this.sortedHashes[0]);
    }

    // Binary search for the closest node
    let l = 0;
    let r = this.sortedHashes.length - 1;
    while (l <= r) {
      const middle = Math.floor((l + r) / 2);
      if (this.sortedHashes[middle] === hash) {
        return this.ring.get(hash);
      }
      if (hash < this.sortedHashes[middle]) {
        r = middle - 1;
      } else {
        l = middle + 1;
      }
    }
    return this.ring.get(this.sortedHashes[l]);
  }

  removeNode(node) {
    for (let i = 0; i < this.numberOfReplicas; i++) {
      const hashKey = `${node}_${i}`;
      const hash = this._hash(hashKey);

      this.ring.delete(hash);

      // Binary search to remove the hash
      const index = this.sortedHashes.indexOf(hash);
      if (index !== -1) {
        this.sortedHashes.splice(index, 1);
      }
    }
  }

  printRing() {
    console.log("Hash Ring:");
    for (const [hash, node] of this.ring.entries()) {
      console.log(`Hash: ${hash}, Node: ${node}`);
    }
    console.log("Sorted Hashes:", this.sortedHashes);
  }
}

const CH = new ConsistentHashing();

CH.addNode("node_1");
CH.addNode("node_2");
CH.addNode("node_3");
CH.addNode("node_4");
CH.addNode("node_5");

console.log(CH.getNode("Key1"));
console.log(CH.getNode("Key2"));
console.log(CH.getNode("Key3"));
console.log(CH.getNode("Key4"));
console.log(CH.getNode("Key5"));

CH.removeNode("node_2");

console.log(CH.getNode("Key1"));
console.log(CH.getNode("Key2"));
console.log(CH.getNode("Key3"));
console.log(CH.getNode("Key4"));
console.log(CH.getNode("Key5"));
