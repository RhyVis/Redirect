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
        this.index = raw.index ?? 'dummy';
        this.key = raw.key ?? raw.index;
        this.redirect = raw.redirect ?? '#';
        console.log(' > Added Keyset: (Index: %s|Key: %s|Redirect: %s)', this.index, this.key, this.redirect);
    }
}

export class Type {
    constructor(state) {
        this.state = state;
    }
}