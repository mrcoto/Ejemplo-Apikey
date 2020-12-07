// Genera una Apikey que será usada por otro cliente/server
// Debe entregarle los parámetros "clientId" y "clientSecret" al interesado (en este caso la cámara python)

const { v4: uuidv4 } = require('uuid')

const commandArgs = process.argv.slice(2)
const clientName = commandArgs[0] || 'Nuevo Cliente'

const clientId = uuidv4().replace(/-/g, '')
const clientSecret = uuidv4().replace(/-/g, '')

// Ejemplo rápido con mongo, puedes usar otro paquete u otra DB
var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/";
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("ejemplo_apikey");
  // revoked indica si puede seguir usando la apikey
  var myobj = { clientId, clientName, clientSecret, revoked: false };
  dbo.collection("apikeys").insertOne(myobj, function(err, res) {
    if (err) throw err;
    db.close();
  });
});

console.log('==========================================================================')
console.log('Entrega los siguientes parámetros al interesado (clientId y clientSecret):')
console.log('==========================================================================')
console.log(`clientName   = ${clientName}`)
console.log(`clientId     = ${clientId}`)
console.log(`clientSecret = ${clientSecret}`)
console.log('==========================================================================')
console.log('El cliente/servidor debiese enviar la cabecera Authorization Basic base64encode(clientId + ":" + clientSecret), ejemplo:')
console.log('==========================================================================')
const base64Encode = Buffer.from(clientId + ":" + clientSecret, "utf8").toString('base64')
console.log(`Authorization Basic ${base64Encode}`)
console.log('==========================================================================')

