let express = require('express'),
    net = require('net'),
    app = express(),
    port = process.env.PORT || 5000,
    bodyParser = require('body-parser'),
    route = require('./routes'),
    cors = require('cors'),
    { rs_port, rs_adress }  = require('./config'),
    { translateKukaData } = require('./iotAgent')


app.use(cors())
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  })
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
app.use('/api', route.router)


app.listen(port);

console.log('RESTful API server started on: ' + port);

// connect with RS232

clientRs232 = new net.Socket();
startConnect = () => {
  clientRs232.connect(rs_port, rs_adress, () => {
        console.log('Connected')
        clientRs232.write('Connected Node with server')
    })
}
//startConnect()
let info = {
  numberOfFinishingLayers: 0
}

clientRs232.on('data', (data) => {
  console.log('Received: ' + data)
  translateKukaData(data, info)
})
translateKukaData('ID PACK=1236.HEIGHT PACK=200.THICK TIM=100', info)
module.exports = { clientRs232 }