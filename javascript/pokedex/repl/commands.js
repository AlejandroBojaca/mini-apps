const Cache = require('./../cache')
const cache = new Cache(10000);

const locationsBaseUrl = 'https://pokeapi.co/api/v2/location-area/';
const pokemonBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';

const commands = {
    help: {
        name: 'help',
        description: 'Displays description',
        callback: helpCallback,
    },
    exit: {
        name: 'exit',
        description: 'Exists the program',
        callback: exitCallback,
    },
    map: {
        name: 'map',
        description: 'Displays the name of 20 location areas in the pokemon world',
        callback: mapCallback,
    },
    mapb: {
        name: 'mapb',
        description: 'Displays the name of previous 20 location areas in the pokemon world',
        callback: mapbCallback,
    },
    explore: {
        name: 'explore',
        description: 'Displays the name of the pokemon that can be encountered in an area',
        callback: exploreCallback,
    },
    catch: {
        name: 'catch',
        description: 'Catches a pokemon',
        callback: catchCallback,
    },
    inspect: {
        name: 'inspect',
        description: 'Check pokemon stats',
        callback: inspectCallback,
    },
    pokedex: {
        name: 'pokedex',
        description: 'Check the pokemon in your pokedex',
        callback: pokedexCallback,
    }
}

const pokedex = new Map()

function helpCallback() {
    console.log("Welcome to the Pokedex!")
    console.log("Usage:\n")
    const keys = Object.keys(commands)
    for(const key of keys) {
        console.log(`${commands[key].name}: ${commands[key].description}`)
    } 
    return null
}
function exitCallback() {
    console.log("Exiting... ")
    process.exit()
}

let config = {
    nextUrl: locationsBaseUrl,
    previousUrl: null
};

async function fetchLocations(url) {
    const cachedData = cache.get(url);
    if (cachedData !== null) {
        config.nextUrl = cachedData[1];
        config.previousUrl = cachedData[2];
        return cache.get(url).value[0];
    } 
    try {
        const response = await fetch(url);
        const data = await response.json();

        const locationNames = data.results.map(location => location.name);

        config.nextUrl = data.next;
        config.previousUrl = data.previous;
        
        cache.add(url, [locationNames, config.nextUrl, config.previousUrl]);

        return locationNames;
    } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
    }
}

async function fetchArea(url) {
    const cachedData = cache.get(url);
    if (cachedData !== null) {
        return cache.get(url).value;
    }
    try {
        const response = await fetch(url);
        const data = await response.json();

        const pokemonNames = data['pokemon_encounters'].map(data => data.pokemon.name);

        cache.add(url, pokemonNames);

        return pokemonNames;
    } catch (error) {
        console.error('Error fetching location:', error);
        return [];
    }
}

async function fetchPokemon(url) {
    const cachedData = cache.get(url);
    if (cachedData !== null) {
        return cache.get(url).value;
    } 
    try {
        const response = await fetch(url);
        const data = await response.json();

        cache.add(url, data);

        return data;
    } catch (error) {
        console.error('Error fetching pokemon');
        return null;
    }
}

async function mapCallback() {
    if (config.nextUrl) {
        const locations = await fetchLocations(config.nextUrl);
        console.log(locations.join('\n'));
    } else {
        console.log('No more locations to display.');
    }
}

async function mapbCallback() {
    if (config.previousUrl) {
        const locations = await fetchLocations(config.previousUrl);
        console.log(locations.join('\n'));
    } else {
        console.log('No previous locations to display.');
    }
}

async function exploreCallback(args) {
    const area = args[0];
    const url = locationsBaseUrl + area;
    const pokemonNames = await fetchArea(url)
    console.log({pokemonNames})
    console.log(pokemonNames.join('\n'));
}

async function catchCallback(args) {
    const pokemon = args[0];
    const url = pokemonBaseUrl + pokemon;
    const pokemonData = await fetchPokemon(url);
    if (pokemonData === null) return false;
    const { name, height, weight, base_experience } = pokemonData;
    let { stats, types } = pokemonData;

    stats = stats.map(stat => ({[stat.stat.name]: stat.base_stat}))
    types = types.map(type => type.type.name)

    const minProb = 5;
    const maxProb = 95;
    const probability = maxProb - ((base_experience - 35) / (350 - 35) * (maxProb - minProb));
    const randomValue = Math.random() * 100;

    const caught = randomValue <= probability;
    console.log(`Throwing pokeball at ${pokemon}`)
    console.log( caught ? `${pokemon} caught` : 'missed')

    if (caught) {
        pokedex.set(pokemon, { name, height, weight, stats, types })
    }

    return randomValue <= probability;
}

async function inspectCallback(args) {
    const pokemon = args[0];

    const stats = pokedex.get(pokemon)
    if (!stats) {
        console.log('This pokemon is not registered in your pokedex')
        return
    }

    console.log(stats)
}

async function pokedexCallback() {
    if (pokedex.size === 0) {
        console.log('You have no pokemon registered')
        return
    }

    for (const [key] of pokedex) {
        console.log(key);
    }
}

module.exports = commands;
