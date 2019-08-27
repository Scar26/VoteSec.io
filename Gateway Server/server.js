const express = require('express');
const app = express();
const server = require('http').createServer(app);
const parser = require('body-parser');
const url = require('url');
const path = require('path');
const fs = require('fs');
const Web3 = require('web3');
const crypto = require('crypto');
const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require('./config');
const endpoint = config.endpoint;
const key = config.key;
const request = require('request')

const IV_LENGTH = 16; 
const secert = 'm1cr0s0ft_z1nd4b4d_h3nt41_h4v3n_';
function encrypt(text, ENCRYPTION_KEY) { //AES 256 in CBC mode
   let iv = crypto.randomBytes(IV_LENGTH);
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
   let encrypted = cipher.update(text);
   AES
   encrypted = Buffer.concat([encrypted, cipher.final()]);

   return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text, ENCRYPTION_KEY) {
 let textParts = text.split(':');
 let iv = Buffer.from(textParts.shift(), 'hex');
 let encryptedText = Buffer.from(textParts.join(':'), 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
 let decrypted = decipher.update(encryptedText);

 decrypted = Buffer.concat([decrypted, decipher.final()]);

 return decrypted.toString();
}

setTimeout(function(){election.methods.concludeElection(parseInt(vid.substr(0,12),16), cid).send({from : defaultAccount},function(e,r){ console.log("Voting Period ends") });},17280000)

server.listen(process.env.PORT || 2050);
console.log("Server listening on port 2050...");

app.use(parser.urlencoded({ extended: true}));

if (typeof web3 !== 'undefined') { web3 = new Web3(web3.currentProvider); }
else { web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')); }

abi = '[  {    "constant": true,    "inputs": [      {        "name": "",        "type": "uint256"      }    ],    "name": "candidates",    "outputs": [      {        "name": "id",        "type": "uint32"      },      {        "name": "name",        "type": "string"      },      {        "name": "votes",        "type": "uint256"      }    ],    "payable": false,    "stateMutability": "view",    "type": "function",    "signature": "0x3477ee2e"  },  {    "constant": true,    "inputs": [],    "name": "cancount",    "outputs": [      {        "name": "",        "type": "uint32"      }    ],    "payable": false,    "stateMutability": "view",    "type": "function",    "signature": "0xb865d909"  },  {    "inputs": [],    "payable": false,    "stateMutability": "nonpayable",    "type": "constructor",    "signature": "constructor"  },  {    "constant": false,    "inputs": [      {        "name": "vid",        "type": "uint256"      },      {        "name": "cid",        "type": "uint256"      }    ],    "name": "castVote",    "outputs": [      {        "name": "",        "type": "string"      }    ],    "payable": false,    "stateMutability": "nonpayable",    "type": "function",    "signature": "0x2c0a3f89"  }]';

abiobj = JSON.parse(abi);
var defaultAccount = '0xEcebc654DC57ee532a63Ea6F2634D186963E7b24'; // Has to be updated according to the local blockchain
var contract_addr = '0x235b67b82a0b389E6D042aFc1595b357c0A66753'; //Has to be updated everytime the contract is migrated, can be obtained via Election.deployed().address in the truffle console
election = new web3.eth.Contract(abiobj, contract_addr , {from : defaultAccount});

console.log('web3 initialized');
constituencies = JSON.parse(fs.readFileSync('constituencies.json')); //We decided to go with json for storing the constituencies list because it will be faster to have the entire tree as a state variable of the server, and this is all public information anyway.
allowed_machines = JSON.parse(fs.readFileSync('ips.json')); //list of whitelisted ips
concount = constituencies.length;

function verify(v,f) {
	console.log("Verify")
	var url = 'https://votesec-cosmos-api.herokuapp.com/test';
	var json = {vid: v, fprint: f}

	request.post(
		url,
		{ form: { data: encrypt(JSON.stringify(json)), key:secert } }, //DUMMY ADD ENCRYPTION
		function (error, response, body) {
			console.log("in anon fxn")
			console.log(response)
			console.log(error)
			if (!error && response.statusCode == 200) {
				console.log(body);
				if (body == 'VALID') {
					return true;
				}
				else{
					return false;
				}
			}
		}
	);
}

app.post('/getcans',function(req,res){
    if(typeof req.body.pin == 'string'){
      pin = req.body.pin;
      if(parseInt(pin)>=0){
        index = -1;
        for(i=0;i<concount;i++){
          if(constituencies[i].id.toString()==pin.toString()){
            index = i;
            break;
          }
        }
        if(index == -1){
          res.status(400).send("Uh oh something went wrong");
        }
        res.send(JSON.stringify(constituencies[index]));
      }
  }
  else{
    res.status(400).send("Uh oh something went wrong");
  }
});

app.post('/voteapi',function(req,res){
  if(allowed_machines.includes(request.connection.remoteAddress.toString())){
    vid = JSON.parse(decrypt(req.body.data,secert)).vid;
    cid = JSON.parse(decrypt(req.body.data,secert)).cid;
    var md5sum = crypto.createHash('md5');
    md5sum.update(vid);
    vid = md5sum.digest('hex');
    md5sum = null;
    fprint = JSON.parse(decrypt(req.body.data,secert)).fprint;
    details = queryContainer(vid);
    verification = verify(vid,fprint);
    if(verification){
      election.methods.castVote(parseInt(vid.substr(0,12),16), cid).send({from : defaultAccount},function(e,r){ console.log(r) });
    }
   }
  else{
    res.status(404).send("Something went wrong");
  }
});

app.post('/updates',function(req,res){
  if(parseInt(req.body.con)>=0){
    for(i=0;i<concount;i++){
      if(constituencies[i].id == req.body.con){
        con = constituencies[i];
        break;
      }
    }
    var cans = [];
    for(i=0;i<con.candidates.length){
      c = election.methods.candidates(con.candidates[i].id).call({from : defaultAccount},function(e,r){ return r });
      candidates.push(c);
    }
    res.send(JSON.stringify(candidates));
  }
});