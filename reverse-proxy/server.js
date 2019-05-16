var express = require('express')
var cors = require('cors')
const proxy = require('express-http-proxy');

var app = express()

var corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true
}

app.use(cors(corsOptions));
app.use(proxy('argos2.test.hypertopic.org'));



 
app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})