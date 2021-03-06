# User & Programmers Manual. 
​
## Prerequisites
In order to use RS232-IoT-Agent the following elements are required:
​
* machine supporting transparent RS232 communication, providing data in ACSII format. Currently, the RS232-IoT-Agent is configiured to support Custom KUKA KR240 robot ASCII based protocol. 
* hardware IoT gateway converting serial communication to ethernet (e.g. USR W610)
* RS232-IoT-Agent installed (see: [link do instrukcji instalacji]) and configured accordingly
* Orion Conext Broker installed and configured (reachable from the RS232-IoT-Agent network)
​
## Initial RS232 to Ethernet hardware gateway setup
​
Is is required that RS-232 Converter and machine firmware use the same serial port communication settings for: 
​
* Baudrate
* Data Bits
* Parity
* Stop (Bits)
​
Additionally You can set UART Autoframe on Enable and set Autoframe Time for 5000. Setting the correct hardware connection between  is beyond the scope of this manual
​
​
## RS232-IoT-Agent configuration
​
In order to use the RS232-IoT-Agent with legacy production machines using RS232 connection an administrator needs provide connection cofigiration within `config.js` file including both harwadware RS232-to-Eth gateway/converter:  
​
- in `config.js` file you must set **rs_host** and **rs_port** variables (default *10.10.100.254* and *8899*)

and the Orion Context Broker:  
​
- in `config.js` file you must set **adress** and **port** of *contextBroker* object
- in `iotagent.js` file you must change name KUKA in `/v2/entities/KUKA/attrs` to name of your entity​​
​
## Data model setup 
RS232-IoT-Agent data model must be compatible with data model prodived by machine/robot program. Currently, the RS232-IoT-Agent is configured to support custom KUKA KR240 robot program providing:
​
​
* layer thickness (THICK TIM) (must be the same unit as weight of a pack)
* weight of a pack (HEIGHT PACK)
* ID of pack (ID PACK)
* status of robot (ROBOT ON) (1 when robot is running or 0 when robot is off)
* robot start/end the layer (1 when robot start to move a layer and 0 when it ends)
​
### Add new entity to Context Broker
If you would like to add new model you can use POST request on path `/api/addDevice/`
In a request body you must use this parameters:
​
```
id
type
attributes: (this is object with fields:)
- carrierId
- carrierLayersProgress
- carrierTimeRemaining
- lastStateChange
- startPaletteProcessingTime
- totalCarrierLayers
- totalCarrierLayersCompleted
```
​
## Multiple Orion Context Brokers support
The RS232-IoT-Agent supports sending contextual data to multiple Orion Context Brokers instances. The If you would like to send data from a machine to more than 1 Orion Context Broker you must add in config.js file in config object another object with fields host and port. For example
​
```
anotherBroker { host: 1.2.3.4, port: 1234 }
```
