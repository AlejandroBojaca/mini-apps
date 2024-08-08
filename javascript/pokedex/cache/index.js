class Cache {
    constructor(interval) {
        this.cache = new Map()
        this.interval = interval;
        this.reapLoop();
    }
    
    add(key, value) {
        const date = new Date().getTime();
        this.cache.set(key, { value, timestamp: date });
    }

    get(key) {
        return this.cache.get(key) || null;
    }

    reapLoop() {
        setInterval(() => {
            for (let [key, value] of this.cache.entries()) {
                const now = new Date().getTime();
                if (value.timestamp < (now - this.interval)) {
                    this.cache.delete(key)
                }
            }
        }, 1000)
    }
}

module.exports = Cache;