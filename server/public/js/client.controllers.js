/** 
 * Client side - angularJS - where controllers are defined.
 * HTML talks to these controllers.
 */

function bin2string(array){
  var result = "";
  for(var i = 0; i < array.length; ++i){
    result+= (String.fromCharCode(array[i]));
  }
  return result;
}

var homeControllers = angular.module('HomeControllers', []);

homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval', 
function ($scope, $rootScope, $http, $interval) {
 
   // Set of all tasks that should be performed periodically
  var runIntervalTasks = function() {
    $http({
      method: 'GET',
      url: '/sensorData'
    }).then(function successCallback(response) {
      if (response.data.Payload !== undefined) {
        
        //Update data on client view
        if(Object.keys(response.data.Payload).length > 0){
          $('#result').text(bin2string(response.data.Payload.data));
            console.log(bin2string(response.data.Payload.data));   
        }
      }
      else {
        //Hanlde exception case
      }
    }, function errorCallback(response) {
        console.log("failed to listen to sensor data");
    });   
  };

  var polling;
  var startPolling = function(pollingInterval) {
    polling = $interval(function() {
      runIntervalTasks();
    }, pollingInterval);
  };

  var stopPolling = function() {
    if (angular.isDefined(polling)) {
      $interval.cancel(polling);
      polling = undefined;
    }
  };
  // Someone asked us to refresh
  $rootScope.$on('refreshSensorData', function(){
    // Check for new input events twice per second
    var pollingInterval = 500;
    // Prevent race conditions - stop any current polling, then issue a new
    // refresh task immediately, and then start polling.  Note that polling
    // sleeps first, so we won't be running two refreshes back-to-back.
    stopPolling();
    runIntervalTasks();
    startPolling(pollingInterval);
  });

  // Tell ourselves to refresh new mail count and start polling
  $rootScope.$broadcast('refreshSensorData');
  $scope.$on('$destroy', function() {
    stopPolling();
  });
}
]);

