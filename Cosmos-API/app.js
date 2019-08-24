const express = require('express');
const app = express();
const server = require('http').createServer(app);
const parser = require('body-parser');
const url = require('url');
const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require('./config');
const crypto = require('crypto');
app.use(parser.urlencoded({ extended: true}));
server.listen(process.env.PORT || 4000);
console.log('server listening on port 4000');
const endpoint = config.endpoint;
const key = config.key;
const secert = "3b7dfe63db3057c6c299969e95beda9530b96a7e";
const client = new CosmosClient({ endpoint, key });

async function queryContainer(checkval,fprint) {
  console.log(`Querying container:\nvoter`);

  const querySpec = {
     query: 'SELECT * FROM voters r WHERE r.id = @vid AND r.fingerprint = @fprin',
     parameters: [
         {
             name: "@vid",
             value: checkval.toString()
         },
         {
           name: "@fprin",
           value : fprint.toString()
         }
     ]
 };
 const { resources } =await client.database('voters').container('voters').items.query(querySpec, {enableCrossPartitionQuery:true}).fetchAll();
 return resources;
};

app.post('/test',function(req,res){
  var vid = req.body.vid;
  var key = req.body.key;
  var fprint = req.body.fprint;
  shasum = crypto.createHash('sha1');
  shasum.update(key.toString());
  auth = shasum.digest('hex');
  shasum = null;
  if(auth != secert){
    res.send("Not so fast nigga");
  }
  else{
    verification = queryContainer(vid,fprint);
    verification.then(function(result){
      console.log(JSON.stringify(result));
      if(JSON.stringify(result)!='[]'){
        res.send("VALID");
      }
      else{
        res.send("INVALID");
      }
    })
  }
});
