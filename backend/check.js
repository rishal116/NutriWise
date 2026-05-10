const fs = require('fs');
const typesFile = fs.readFileSync('src/types/types.ts', 'utf8');
const inversifyFile = fs.readFileSync('src/configs/inversify.ts', 'utf8');

const typeMatches = typesFile.matchAll(/^\s*([a-zA-Z0-9_]+):/gm);
const types = new Set();
for (const match of typeMatches) {
    types.add(match[1]);
}

const inversifyMatches = inversifyFile.matchAll(/TYPES\.([a-zA-Z0-9_]+)/g);
for (const match of inversifyMatches) {
    if (!types.has(match[1])) {
        console.log('MISSING:', match[1]);
    }
}
