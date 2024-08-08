const readline = require('node:readline');
const commands = require('./commands')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion() {
    rl.question("pokedex > ", async name => {
        const [main, ...args] = name.split(' ');
        if (commands[main] === undefined) {
            console.log('Unknown command');
        } else {
            try {
                await commands[main].callback(args)
            } catch (e) {
                console.log(e)
            }
        }
        askQuestion()   
    });
}

module.exports = askQuestion;
