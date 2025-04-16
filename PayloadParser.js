function convertToSignedInt(payload) {
    var sign = payload[0] & (1 << 7);
    var x = ((payload[0] << 8) | payload[1]);
    if (sign) {
       x = 0xFFFF0000 | x;  // fill in most significant bits with 1's
    }           
    return x;
}

function parseUplink(device, payload) {
    
    var decoded = [];
    
    var sensor_types = {
        0  : {'size': 1, 'name': 'DIGITAL_INPUT_'},
        1  : {'size': 1, 'name': 'DIGITAL_OUTPUT_'},
        2  : {'size': 2, 'name': 'ANALOG_INPUT_'},
        3  : {'size': 2, 'name': 'ANALOG_OUTPUT_'},
        101: {'size': 2, 'name': 'ILLUMINANCE_'},
        102: {'size': 1, 'name': 'PRESENCE_'},
        103: {'size': 2, 'name': 'TEMPERATURE_SENSOR_'},
        104: {'size': 1, 'name': 'HUMIDITY_'},
        113: {'size': 6, 'name': 'ACCELEROMETER_'},
        115: {'size': 2, 'name': 'BAROMETER_'},
        134: {'size': 6, 'name': 'GYROMETER_'},
        136: {'size': 9, 'name': 'GPS_'}
    };    
    
    var i = 0, value, endpoint;
    
    while(i < payload.length) { 
        
        s_ch = payload[i++];    //Channel
        address = s_ch.toString();
        s_type = payload[i++];  //Message Type
        s_size = sensor_types[s_type].size; //Data length        

        switch (s_type) {
        case 0  :  // Digital Input
        case 1  :  // Digital Output
            value = payload[i]<<8 ? 1 : 0;
            endpoint = device.endpoints.byAddress(address);
            if (endpoint != null)
            {
                endpoint.updateApplianceStatus(value);
            }
            break;          
        case 2  :  // Analog Input
        case 3  :  // Analog Output
            value = ((payload[i]<<8 | payload[i+1]))*0.01;
            endpoint = device.endpoints.byAddress(address);
            if (endpoint != null)
            {
                endpoint.updateGenericSensorStatus(value);
            }
        case 101:  // Illuminance Sensor
            value = (payload[i]<<8 | payload[i+1]);
            endpoint = device.endpoints.byAddress(address);
            if (endpoint != null)
            {
                endpoint.updateLightSensorStatus(value);
            }
            break;      
        case 102:  // Presence 
            value = payload[i]<<8 ? 2 : 1;
            endpoint = device.endpoints.byAddress(address);
            if (endpoint != null)
            {
                endpoint.updateIASSensorStatus(value);
            }
            break;          
        case 103:  // Temperature Sensor
            value = convertToSignedInt(payload.slice(i, i+2))*0.1;
            endpoint = device.endpoints.byAddress(address);
            if (endpoint != null)
            {
                endpoint.updateTemperatureSensorStatus(value);
            }
        case 104:  // Humidity Sensor
            value = payload[i] * 0.5;
            endpoint = device.endpoints.byAddress(address);
            if (endpoint != null)
            {
                endpoint.updateHumiditySensorStatus(value);
            }
            break;              
        case 115:  // Barometer
            value = (payload[i]<<8 | payload[i+1]) * 0.1;
            endpoint = device.endpoints.byAddress(address);
            if (endpoint != null)
            {
                endpoint.updatePressureSensorStatus(value);
            }
            break;              
/*
        case 113:  // Accelerometer
        case 134:  // Gyrometer
            axes = ["_X", "_Y", "_Z"];
            var div = s_type === 113 ? 1000 : 100;
            for (var j = 0; j < 3; j++) {
                index = i + (j*2);
                var axis = (((payload[index] & 0xFF) << 8) | (payload[index+1] & 0xFF)); // Get Value
                axis = payload[index] & (1 << 7) ? axis = 0xFFFF0000 | axis : axis; // Get Sign as this is Signed INT
                decoded.push({field: sensor_types[s_type].name+s_ch+axes[j],value: axis/div});                
            }
            break;              
      case 136:  // GPS
            var lat = (payload[6]<<24>>8 | payload[7]<<8 | payload[8])/10000;
            var long = (payload[9]<<24>>8 | payload[10]<<8 | payload[11])/10000;
            var altitude = ((payload[12]<<16 | payload[13]<<8 | payload[14])/100);
            break;
        }        
*/
       i += s_size;
    }
}

function buildDownlink(device, endpoint, command, payload) 
{ 
     payload.port = 10;  // This device receives commands on LoRaWAN port 10 
     payload.buildResult = downlinkBuildResult.ok; 
     channel = Number(device.address);
     switch (command.type) { 
         case commandType.onOff: 
             switch (command.onOff.type) { 
                 case onOffCommandType.turnOn: 
                     payload.setAsBytes(channel, 1, 1);
                     break; 
                 case onOffCommandType.turnOff: 
                     payload.setAsBytes(channel, 1, 0);
                     break; 
                 default: 
                     payload.buildResult = downlinkBuildResult.unsupported; 
                     break; 
             } 
             break; 
         default: 
             payload.buildResult = downlinkBuildResult.unsupported; 
             break; 
     }
}
