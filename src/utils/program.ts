import chalk from 'chalk';
import readline from 'readline';

export function promptToContinue(prompt: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(`${prompt} ${chalk.green("(y/n)")}: `, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y');
        });
    });
}
