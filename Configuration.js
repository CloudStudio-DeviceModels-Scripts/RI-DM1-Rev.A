function getConfiguration(config)
{
  config.addressLabel = {en: "DevEUI", es: "DevEUI"};
}

function getEndpoints(deviceAddress, endpoints)
{
  endpoints.addEndpoint("1", "DIGITAL_INPUT_1", endpointType.appliance);
  endpoints.addEndpoint("2", "DIGITAL_INPUT_2", endpointType.appliance);
  endpoints.addEndpoint("3", "DIGITAL_INPUT_3", endpointType.appliance);
  endpoints.addEndpoint("4", "DIGITAL_INPUT_4", endpointType.appliance);
  endpoints.addEndpoint("5", "DIGITAL_INPUT_5", endpointType.appliance);
  endpoints.addEndpoint("6", "DIGITAL_INPUT_6", endpointType.appliance);
  var e = endpoints.addEndpoint("33", "DIGITAL_OUTPUT_33", endpointType.appliance);
  e.accessType = endpointAccessType.readWrite;
  e = endpoints.addEndpoint("34", "DIGITAL_OUTPUT_34", endpointType.appliance);
  e.accessType = endpointAccessType.readWrite;
  e = endpoints.addEndpoint("35", "DIGITAL_OUTPUT_35", endpointType.appliance);
  e.accessType = endpointAccessType.readWriteCommand;
  e = endpoints.addEndpoint("36", "DIGITAL_OUTPUT_36", endpointType.appliance);
  e.accessType = endpointAccessType.readWriteCommand;
  endpoints.addEndpoint("49", "TEMPERATURE_SENSOR_49", endpointType.temperatureSensor);
  e = endpoints.addEndpoint("50", "ANALOG_INPUT_50", endpointType.genericSensor);
  e.variableTypeId = 1271;
  e = endpoints.addEndpoint("56", "ANALOG_OUTPUT_56", endpointType.genericSensor);
  e.accessType = endpointAccessType.readWriteCommand;
  e.variableTypeId = 1272;
}

function validateDeviceAddress(address, result)
{  
  result.ok = true; 
  if (address.length != 16) {
     result.ok = false;
     result.errorMessage = {
       en: "The address must be 16 characters long", 
       es: "La dirección debe tener exactamente 16 caracteres"
     };
   }
}

function updateDeviceUIRules(device, rules)
{
  rules.canCreateEndpoints = true;
}

function updateEndpointUIRules(endpoint, rules)
{
  rules.canDelete = false;
}
