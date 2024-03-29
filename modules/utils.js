import fs from 'fs';
import { Keyset } from './objects.js';

const keysets = Array()

export function compareKeysets(challenge) {
    let tmp1 = keysets.filter(keyset => keyset.index === challenge.index);
    if (tmp1.length == 0) {
        console.log('# Challenge failed with code 6');
        return 6;
    }
    let tmp2 = keysets.filter(keyset => keyset.key === challenge.key);
    if (tmp2.length == 0) {
        console.error('# Challenge failed with code 9');
        return 9;
    } else {
        const final = tmp2[0];
        console.log('# Challenge succeed with target: %s(%s)', final.index, final.redirect);
        return final.redirect;
    }
}

export function readKeysets(keyPath) {
    console.log('# Performing keysets reading...');
    keysets.length = 0;
    fs.readFile(keyPath, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            keysets.push(new Keyset({index: 'dummy'}));
            return 3;
        }

        const jsonParsed = JSON.parse(data);
        for (var i in jsonParsed) {
            let jsonElement = jsonParsed[i];
            let keyset = new Keyset(jsonElement);
            keysets.push(keyset);
        }

        console.log('# Final: %s', keysets.length);
        return 1;
    })
}