import fs from 'fs';
import { Keyset } from './objects.js';

const keysets = Array()

export function compareKeysets(challenge) {
    let tmp1 = keysets.filter(keyset => {
        let { index, key, alias } = keyset;
        if (challenge.index === index) {
            return true;
        } else if (alias.length > 0) {
            console.log(' > Challenge: Apply alias.');
            if (alias.filter(a => challenge.index === a).length > 0) {
                if (index === key) {
                    console.log(' > Challenge: Original Index & Key equal, correct challenge key as %s.', key);
                    challenge.key = key;
                }
                console.log(' > Challenge: Alias passed.');
                return true;
            } else {
                console.log(' > Challenge: Alias not matched.');
                return false;
            }
        }
    });

    if (tmp1.length == 0) {
        console.log(' > Challenge: Failed with code 6');
        return 6;
    }

    let tmp2 = keysets.filter(keyset => keyset.key === challenge.key);

    if (tmp2.length == 0) {
        console.log(' > Challenge: Failed with code 9');
        return 9;
    } else {
        const final = tmp2[0];
        console.log(' > Challenge: Succeed with target: %s(%s)', final.index, final.redirect);
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

        console.log('# Final Index: %s', keysets.length);
        return 1;
    })
}