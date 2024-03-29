import express from 'express';
import bodyParser from 'body-parser';
import 'pug';
import figlet from 'figlet';
import {readKeysets, compareKeysets} from './modules/utils.js';
import {KeyChallenge, Type} from './modules/objects.js';

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const keyPath = './key.json';

app.use(express.static('./public'));
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res, _) => {
    let reload = req.query['reload'];
    var type;
    if (reload) {
        console.log('# Commited Reload.');
        readKeysets(keyPath);
        type = new Type(1);
    } else {
        type = new Type(0);
    }
    
    res.render('main', type);
})

app.post('/', urlencodedParser, (req, res) => {
    let challenge = new KeyChallenge(req.body);
    let result = compareKeysets(challenge);

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
    console.log(
        figlet.textSync("Redirect", {
            font: "3D Diagonal",
            horizontalLayout: "default",
            verticalLayout: "default"
        })
    );
    console.log('# Server init at %s:%s', host, port);
    readKeysets(keyPath);
})
