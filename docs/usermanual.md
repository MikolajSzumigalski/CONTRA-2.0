To use component you must fill adress of **Context Broker** and adress of **RS-232 Converter** in **config.js** file. Next step is programming the KUKA robot. Our component need information about:
- thick of the layer (THICK TIM) (must be the same unit as weight of a pack)
- weight of a pack (HEIGHT PACK)  
- ID of pack (ID PACK)  
- status of robot (ROBOT ON) (1 when robot is running or 0 when robot is off) 
- robot start/end the layer (1 when robot start move layer and 0 when end)
