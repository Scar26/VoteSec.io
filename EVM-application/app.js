'use strict'

const getcansDomainName = '10.42.0.114:2050' //have to be changed according to the set-up
const voteapiDomainName = '10.42.0.114:2050'

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

/**********************/
//var routes = require('./routes/index');

var app = express();

var sockIO = require('socket.io')();
app.sockIO = sockIO;

var client = null

// view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


function web3api(candidate, uid) {
	/********DUMMY CODE********/
	return true
}

sockIO.on('connection', function (socket) {
	client = socket
	console.log('socket connection');
	if (socket.handshake.address != '127.0.0.1')
		socket.on('disconnect', function () {
			resetClient()
			client = null
		})
	socket.on('vote', function (candidate) {
		console.log("Vote Received")
		console.log("Fingerpring Post")
		if (client != null) {
			if (verified == true) {
				request.post(
					'http://' + voteapiDomainName + '/voteapi',
					{ form: {data : encrypt(JSON.stringify({ vid: aadhaar.uid, cid: candidate , fprint: fingerprint}),ENCRYPTION_KEY)} },
					function (error, response, body) {
						console.log(error)
						console.log(response)
						if (!error && response.statusCode == 200) {
							console.log(body);
							client.emit('votereturn', 'VOTE CASTED')
						}
					}
				);
				client.emit('votereturn', 'VOTE CASTED')
			}
			else {
				client.emit('votereturn', 'VOTER NOT VERIFIED')
			}
			console.log("Resetting after VOTE")
			resetClient();
		}
		else {
			res.render('error', { message: "ERROR: No client connection" })
		}
	})
})

//var app = express.app();
var xmlparser = require('xml2js').parseString;

var fingerprint = null
var aadhaar = null
var verified = false

const crypto = require('crypto');

const ENCRYPTION_KEY = "m1cr0s0ft_z1nd4b4d_h3nt41_h4v3n_"; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
	let encrypted = cipher.update(text);

	encrypted = Buffer.concat([encrypted, cipher.final()]);

	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
	let textParts = text.split(':');
	let iv = Buffer.from(textParts.shift(), 'hex');
	let encryptedText = Buffer.from(textParts.join(':'), 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
	let decrypted = decipher.update(encryptedText);

	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
}


function resetClient() {
	console.log("Resetting Client socket")
	fingerprint = null
	aadhaar = null
	verified = false
}

function getCandidateList(pc) {
	console.log("Generating Candidate List")
	let list
	console.log("pincode- " + pc)
	request.post(
		'http://' + getcansDomainName + '/getcans',
		{ form: { pin: pc } },
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				list = JSON.parse(body).candidates
				console.log("LOL", list)
				if (client != null) {
					client.emit('candidatelist', list)
					verified = true
				}
				else {
					resetClient()
				}
			}
		}
	);
}
var publickey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCOxAtKOVqBMGdwzv8KLOaQokgX
YAybp+bOZ8AGPx5XDj0c2Dfetx/CdCU50xlJl0ueSrV7cq/mqEmas6Jz6wgwDr71
XEy/eKnLNt6w/SOYHhBoDgjf753cwIzrfIF+P4zwE98hjDSS//8eOSyOfHpYlWPm
qSJL9VYFGiTG4yJ2NwIDAQAB
-----END PUBLIC KEY-----`


function encryptRSA(toEncrypt) {
	const buffer = Buffer.from(toEncrypt, 'utf8')
	const encrypted = crypto.publicEncrypt(publickey, buffer)
	return encrypted.toString('base64')
  }

  function decryptRSA(toDecrypt) {
	const buffer = Buffer.from(toDecrypt, 'base64')
	const decrypted = crypto.privateDecrypt(
	  {
		key: privatekey,
		passphrase: '',
	  },
	  buffer,
	)
	return decrypted.toString('utf8')
  }

function verify() {
	console.log("Verify")
	var url = 'https://votesec-cosmos-api.herokuapp.com/test';
	console.log(fingerprint, ENCRYPTION_KEY)
	var json = {vid: 1234, fprint: fingerprint}
	request.post(
		url,
		{ form: { data: encryptRSA(JSON.stringify(json)), key:ENCRYPTION_KEY } }, //DUMMY ADD ENCRYPTION
		function (error, response, body) {
			console.log("in anon fxn")
			console.log(response)
			console.log(error)
			if (!error && response.statusCode == 200) {
				console.log(body);
				if (body == 'VALID') {
					client.emit('verified')
					verified = true
					getCandidateList(aadhaar.pc)
				}
				else if (body == 'INVALID') {
					client.emit('verifailed')
					resetClient()
				}
			}
		}
	);
}


var request = require('request');

app.post('/qr', function (req, res, next) {
	if (client != null) {
		if (aadhaar == null) {
			xmlparser(req.body.text, function (err, result) {
				console.log(JSON.stringify(result.PrintLetterBarcodeData.$.uid))
				aadhaar = result.PrintLetterBarcodeData.$
				//aadhaar = { name: "Manas", pc: "201007" }
			})
			res.render('error', { message: "SUCCESS: QR Stored" })
			client.emit('qr', aadhaar)
		}
		else {
			res.render('error', { message: "ERROR: QR Already Stored" })
		}
		if (fingerprint != null && aadhaar != null)
			verify()
	}
	else {
		res.render('error', { message: "ERROR: No client connection" })
		resetClient()
	}
})

app.post('/fingerprint', function (req, res, next) {
	console.log("Fingerpring Post")
	if (client != null) {
		if (fingerprint == null) {
			fingerprint = req.body.fingerprint
			res.render('error', { message: "SUCCESS: Fingerprint Stored" })
			client.emit('fingerprint')
		}
		else {
			res.render('error', { message: "ERROR: Fingerprint Already Stored" })
		}
		if (fingerprint != null && aadhaar != null)
			verify()
	}
	else {
		res.render('error', { message: "ERROR: No client connection" })
		resetClient()
	}
})

app.get('/', function (req, res, next) {
	console.log("Root Get")
	console.log(req.connection.remoteAddress)
	if (!(req.connection.remoteAddress != '127.0.0.1' || req.connection.remoteAddress != "::1"))
		res.render('error', { message: 'Illegal client' })
	else if (client == null)
		res.render('index')
	else
		res.render('error', { message: 'EVM already connected' })
})

module.exports = app;
