### Connect KUKA robot with Context Broker by RS232 Converter

To use component you must fill adress of **Context Broker** and adress of **RS-232 Converter** in **config.js** file. Next step is programming the KUKA robot. Our component need information about:
- **thick of the layer** (THICK TIM) (must be the same unit as weight of a pack)
- **weight of a pack** (HEIGHT PACK)  
- **ID of pack** (ID PACK)  
- **status of robot** (ROBOT ON) (1 when robot is running or 0 when robot is off) 
- **robot start/end the layer** (1 when robot start move layer and 0 when end)

Very important thing is set the same settings in RS-232 Converter and computer with program for KUKA. You must set the same:
- Baudrate
- Data Bits
- Parity
- Stop (Bits)

You can set UART Autoframe on **Enable** and set *Autoframe Time* for **5000**

### Add new entity to Context Broker

If you would like to add new model you can use **POST** request on path `/api/addDevice/`  
In body you must use this parameters:
- id
- type
- attributes: (this is object with fields)
- - carrierId
- - carrierLayersProgress
- - carrierTimeRemaining
- - lastStateChange
- - startPaletteProcessingTime
- - totalCarrierLayers
- - totalCarrierLayersCompleted

### Connection with many Context Brokers

If you would like to send data from KUKA robot to more than 1 Context Broker you must add in `config.js` file in config object another object with fields **host** and **port**. For example  
`anotherBroker {  
  host: 1.2.3.4,  
  port: 1234  
}`  
