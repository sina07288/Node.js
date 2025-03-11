import { readFile, writeFile } from 'fs/promises';

async function main() {
    try {
        const content = await readFile('instrukce.txt', 'utf8');
        const n = parseInt(content.trim(), 10);

        if (isNaN(n) || n < 0) {
            console.error('Chyba: Neplatné číslo v souboru instrukce.txt.');
            return;
        }

        const promises = [];
        for (let i = 0; i <= n; i++) {
            promises.push(writeFile(`${i}.txt`, `Soubor ${i}`));
        }

        await Promise.all(promises);

        console.log(`Úspěšně vytvořeno ${n + 1} souborů.`);
    } catch (error) {
        console.error('Chyba:', error.message);
    }
}

main();
