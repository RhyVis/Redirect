var indexSet = new Set();

export class KeyChallenge {
    constructor(raw) {
        this.index = raw.index.replace(/\W/gi, '').toLowerCase();
        if (raw.key != '') {
            this.key = raw.key?.replace(/\W/gi, '').toLowerCase();
        } else {
            this.key = this.index;
        }
        console.log('# Challenge: (Index: %s|Key: %s)', this.index, this.key);
    }
}

export class Keyset {
    constructor(raw) {
        if (raw.index == undefined || raw.index === '') {
            this.index = 'dummy';
        } else {
            this.index = raw.index.replace(/\W/gi, '').toLowerCase();
        }

        if (indexSet.has(this.index)) {
            throw new Error('Same index not allowed! Value: ' + this.index);
        } else {
            indexSet.add(this.index);
        }

        this.alias = Array();
        if (typeof(raw.alias) == "string") {
            this.alias[0] = raw.alias;
        } else if (Array.isArray(raw.alias)) {
            for (var i in raw.alias) {
                let tmp = raw.alias[i]?.replace(/\W/gi, '').toLowerCase();
                if (indexSet.has(tmp)) {
                    throw new Error('Same alias not allowed! Value: ' + tmp);
                } else {
                    indexSet.add(tmp);
                    this.alias[i] = tmp;
                }
            }
        }

        if (raw.key == undefined || raw.key === '') {
            this.key = this.index;
        } else {
            this.key = raw.key.replace(/\W/gi, '').toLowerCase();
        }

        if (raw.redirect == undefined || raw.redirect === '') {
            this.redirect = '#';
        } else {
            this.redirect = raw.redirect;
        }

        console.log(' > Added Keyset: (Index: %s|Alias: %s|Key: %s|Redirect: %s)', this.index, this.alias, this.key, this.redirect);
    }
}

export class Type {
    constructor(state) {
        this.state = state;
    }
}