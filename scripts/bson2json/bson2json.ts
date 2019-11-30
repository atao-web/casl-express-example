import { writeFileSync } from 'fs';
import { argv, env } from 'process';
import { exec } from 'child_process';

const JSON_EXT = '.json';
const BSON_EXT = '.bson';

const DEST_ROOT = (argv.length > 2 ? argv[2] : null) || env.DEST_ROOT || ''; // should already exists
const argList = argv.length > 3 ? argv.slice(3) : null;
const envList = env.FILE_LIST ? env.FILE_LIST.split(' ') : null;
const FILE_LIST = argList || envList || [];

console.log('bson2json starting')

FILE_LIST.forEach(partial => {
    const filePaths = { src: null, dst: null };
    const hasExt = partial && partial.trim().endsWith(BSON_EXT);
    filePaths.src = partial + (hasExt ? '' : BSON_EXT);
    filePaths.dst = DEST_ROOT + partial.trim().slice(0, hasExt ? -BSON_EXT.length : undefined) + JSON_EXT;
    console.log('bson2json with filePaths: ', filePaths);

    exec(`bsondump -v ${filePaths.src}`, (error, stdout, stderr) => {
        if (error) {
            // node couldn't execute the command
            throw error;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        const data = stdout.split('\n').filter(s => s && s.trim()).map(s => JSON.parse(s));

        const fileContent = JSON.stringify(data, null, 2) + "\n";
        writeFileSync(filePaths.dst, fileContent, { "encoding": "utf8" });

    });
});
