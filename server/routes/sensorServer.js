exports.returnCurrentSensorData = function(sensorData){
  return function(req, res){
    res.send(sensorData);
  };
};
