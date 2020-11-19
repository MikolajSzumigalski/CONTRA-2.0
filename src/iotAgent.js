let express = require('express'),
    http = require('http')
    iotAgentLib = require('iotagent-node-lib'),
    axios = require('axios'),
    { config, modbus_adress, modbus_port }  = require('./config'),

exports.initSouthbound = (callback) => {
  southboundServer = {
      server: null,
      app: express(),
      router: express.Router()
  };

  southboundServer.app.set('port', 8080);
  southboundServer.app.set('host', '0.0.0.0');

  southboundServer.router.post('/iot/d', manageULRequest);
  southboundServer.server = http.createServer(southboundServer.app);
  southboundServer.app.use('/', southboundServer.router);
  southboundServer.server.listen(southboundServer.app.get('port'), southboundServer.app.get('host'), callback);
}

const manageULRequest = (req, res, next) => {
  var values;

  iotAgentLib.retrieveDevice(req.query.i, req.query.k, function(error, device) {
      if (error) {
          res.status(404).send({
              message: "Couldn't find the device: " + JSON.stringify(error)
          });
      } else {
          values = parseUl(req.query.d, device);
          iotAgentLib.update(device.name, device.type, '', values, device, function(error) {
              if (error) {
                  res.status(500).send({
                      message: 'Error updating the device'
                  });
              } else {
                  res.status(200).send({
                      message: 'Device successfully updated'
                  });
              }
          });
      }
  });
}

function parseUl(data, device) {
    function findType(name) {
        for (var i = 0; i < device.active.length; i++) {
            if (device.active[i].name === name) {
                return device.active[i].type;
            }
        }

        return null;
    }

    function createAttribute(element) {
        var pair = element.split('|'),
            attribute = {
                name: pair[0],
                value: pair[1],
                type: findType(pair[0])
            };

        return attribute;
    }

    return data.split(',').map(createAttribute);
}

let updateAtrribute = (attrName, attrValue) => {
	axios.put(`http://${config.contextBroker.host}:${config.contextBroker.port}/v2/entities/KUKA/attrs/${attrName}/value`,
		`"${attrValue}"`,
		{ headers: {
			'Content-Length': attrValue.length,
			'Content-Type': 'text/plain'
		}})
		.then(res => {
			console.log('update is done')
		})
		.catch(err => {
			console.log('err', err)
		})
}

exports.translateKukaData = (data, info) => {
  let dataList = data.toString().split('.')
  let dataObject = {}
	dataList.map(item => {
    let newItem = item.split('=')
    if(newItem[0] && newItem[1]) {
      dataObject[newItem[0]] = newItem[1]
    }
  })
  if(dataObject['HEIGHT PACK'] && dataObject['THICK TIM']) {
    info.numberOfLayers = parseInt(dataObject['HEIGHT PACK']) / parseInt(dataObject['THICK TIM'])
    updateAtrribute('totalCarrierLayers', info.numberOfLayers)
  }
  if(dataObject['ROBOT ON']) {
    dataObject['ROBOT ON'] = !!+dataObject['ROBOT ON']
    updateAtrribute('active', dataObject['ROBOT ON'])
    updateAtrribute('lastStateChange', + new Date())
  }
  if(dataObject['ID PACK']) {
    info.numberOfFinishingLayers = 0
    updateAtrribute('carrierId', parseInt(dataObject['ID PACK']))
    updateAtrribute('totalCarrierLayersCompleted', info.numberOfFinishingLayers)
    updateAtrribute('startPaletteProcessingTime', + new Date())
  }
  if(dataObject['WRST'] && dataObject['WRST'] === '1') {
    info.numberOfFinishingLayers += 1
    updateAtrribute('totalCarrierLayersCompleted', info.numberOfFinishingLayers)
    updateAtrribute('carrierLayersProgress', info.numberOfLayers * 100 / info.numberOfFinishingLayers)
  }
	let namesObj = {
		"THICK TIM": "thick",
		"ID PACK": "carrierId",
		"WRST": "layerNumber",
		"HEIGHT PACK": "packHigh",
		"ROBOT ON": "active"
	  }
	if (dataList[0] === "ROBOT ON") {
    dataList[1] = !!+dataList[1]
    updateAtrribute('lastStateChange', + new Date())
    }
  if (dataList[0] === "ID PACK") {
      updateAtrribute('startPaletteProcessingTime', + new Date())
    }
  namesObj[dataList[0]] && updateAtrribute(namesObj[dataList[0]], dataList[1])
}