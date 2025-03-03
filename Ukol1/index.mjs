import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

async function main() {
    try {
        const instructions = await readFile('instrukce.txt', 'utf8');
        const [sourceFile, targetFile] = instructions.trim().split(' ');

        if (!sourceFile || !targetFile) {
            console.error('Chyba: Špatný formát instrukcí.');
            return;
        }

        if (!existsSync(sourceFile)) {
            console.error(`Chyba: Zdrojový soubor "${sourceFile}" neexistuje.`);
            return;
        }

        const data = await readFile(sourceFile, 'utf8');

        await writeFile(targetFile, data);
        console.log(`Úspěšně zkopírováno z "${sourceFile}" do "${targetFile}".`);
    } catch (error) {
        console.error('Chyba:', error.message);
    }
}

main();