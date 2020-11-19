let config = {
    logLevel: 'DEBUG',
    contextBroker: {
        host: '',
        port: '1026'
    },
    server: {
        port: 4041,
        host: '0.0.0.0'
    },
    deviceRegistry: {
        type: 'memory'
    },
    types: {
        'Light': {
            url: '/',
            apikey: '',
            type: 'Light',
            commands: [],
            lazy: [
                {
                    name: 'luminescence',
                    type: 'Lumens'
                }
            ],
            active: [
                {
                    name: 'status',
                    type: 'Boolean'
                }
            ]
        }
    },
    service: 'openiot',
    subservice: '/',
    providerUrl: 'http://iot-agent:4041',
    deviceRegistrationDuration: 'P1M',
    defaultType: 'Light'
};
let modbus_port = 8899
let modbus_adress = ''
let rs_port = 8899
let rs_adress = ''

module.exports = {
    config,
    modbus_port,
    modbus_adress,
    rs_port,
    rs_adress
}