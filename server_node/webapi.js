const express = require('express')
const app = express()
const port = 3000

// Middleware (para el ejemplo, solo protege una ruta)
app.use('/api/protegido', function (req, res, next) {
  // Aquí debería llegar como Authorization Basic ODY5MzJjZjA4ZTViNGU3MGFmZDI0YjFlOTM3YmQxYTg6ZWY3M2NmNTRmODFjNDVjZjljNTFmODg5Nzc1MzQyN2E=
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'Debe enviar el Apikey' });
  }

  const tokens = req.headers.authorization.split(' ')
  if (tokens.length !== 2 || tokens[0] !== 'Basic' || !tokens[1]) {
    return res.status(403).json({ error: 'Debe enviar el Apikey como Authorization Basic <apikey>' });
  }

  try {
    const apikey = tokens[1]
    var decoded = Buffer.from(apikey, 'base64').toString('ascii')
    console.log(decoded)
  } catch(Exception) {
    return res.status(403).json({ error: 'Apikey inválido' });
  }

  const client = decoded.split(':')
  if (client.length !== 2) {
    return res.status(403).json({ error: 'Apikey inválido' });
  }
  
  const clientId = client[0]
  const clientSecret = client[1]
  var MongoClient = require('mongodb').MongoClient
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("ejemplo_apikey")
    var query = { clientId, clientSecret }
    dbo.collection("apikeys").findOne(query, function(err, result) {
      if (err) throw err;
      if (!result) {
        return res.status(403).json({ error: 'Apikey no encontrada' });
      }
      if (result.revoked) {
        return res.status(403).json({ error: 'Cliente revocado, comunícate con administración' });
      }
      next();
      db.close();
    })
  });
});

app.post('/api/protegido', (req, res) => {
  res.send('Si pudiste ver esto, es porque tienes acceso!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})