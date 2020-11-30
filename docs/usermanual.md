# User & Programmers Manual  
## Initial setup
In order to use the RS232_IoT Agent for legacy production machines an administrator needs provide connection cofigiration within `config.js` file including both harwadware RS232-to-Eth gateway/converter:
- in `config.js` file set `rs_adress` and `rs_port` variables (default *10.10.100.254* and *8899*)
- converter parameters you can set in browser if computer is connected with converter Access Point (default adress is 10.10.100.254). In this page you should set: **Baudrate**, **Parity**, **Stop (Bits)** and **Data Bits**. You must set this parameters the same as in KUKA computer serial port
and the Orion Context Broker:
- in `config.js` file set host and port field in `contextBroker` object
- in `iotAgent.js` file set entity name in line with `/v2/entities/KUKA/attrs` (replace KUKA with entity name)
## Data model setup
Next step is programming the KUKA robot. Our component need information about:
- thick of the layer (THICK TIM) (must be the same unit as weight of a pack)
weight of a pack (HEIGHT PACK)
- ID of pack (ID PACK)
- status of robot (ROBOT ON) (1 when robot is running or 0 when robot is off)
robot start/end the layer (1 when robot start move layer and 0 when end)
