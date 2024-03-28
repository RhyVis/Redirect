var express = require('express');
var bodyParser = require('body-parser');
var pug = require('pug');
var fs = require('fs');

var app = express();

var keysets = Array();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('./public'));
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res, _) => {
    const reload = req.query['reload'];
    var type;
    if (reload) {
        console.log('# Commited Reload.');
        readKeysets();
        type = new Type(1);
    } else {
        type = new Type(0);
    }
    
    res.render('main', type);
})

app.post('/', urlencodedParser, (req, res) => {
    const challenge = new KeyChallenge(req.body);
    const result = compareKeysets(challenge);

    switch (result) {
        case 6 : {
            res.render('main', new Type(6));
            break;
        }
        case 9 : {
            res.render('main', new Type(9));
            break;
        }
        default : {
            res.redirect(result);
            break;
        }
    }

    res.end();
})

var server = app.listen('14444', function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('# Server init at %s:%s', host, port);
    readKeysets();
})

function compareKeysets(challenge) {
    let tmp1 = keysets.filter(keyset => {
        return keyset.index === challenge.index;
    });
    if (tmp1.length == 0) {
        console.log('# Challenge failed with code 6');
        return 6;
    }
    let tmp2 = keysets.filter(keyset => {
        return keyset.key === challenge.key;
    });
    if (tmp2.length == 0) {
        console.log('# Challenge failed with code 9');
        return 9;
    } else {
        const final = tmp2[0];
        console.log('# Challenge succeed with target: %s(%s)', final.index, final.redirect);
        return final.redirect;
    }
}

function readKeysets() {
    console.log('# Performing keysets reading...');
    keysets.length = 0;
    fs.readFile('./key.json', 'utf-8', (err, data) => {
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

class KeyChallenge {
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

class Keyset {
    constructor(raw) {
        this.index = raw.index ?? 'dummy';
        this.key = raw.key ?? raw.index;
        this.redirect = raw.redirect ?? '#';
        console.log(' > Added Keyset: (Index: %s|Key: %s|Redirect: %s)', this.index, this.key, this.redirect);
    }
}

class Type {
    constructor(state) {
        this.state = state;
    }
}