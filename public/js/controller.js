angular.module("device", []).factory('MCE' , function($http , $rootScope) {

  function MCE() {
      this.version = "1.0";
      var count = 0 ; 
      this.run = function(pluginParams) { 
          
          $http.get('tryConnectToUSBPort' ,{params:pluginParams ,timeout:3000})
                    .then(function(response) {
                      
                      //create DEMO response
                      response = {recognizedDevice : { vendor:"one plus",model:"one"}};
                     
                      for (var i = pluginParams.Recognize.attempts - 1; i >= 0; i--) {
                        if (i == 0)
                           response = {recognizedDevice : true};
                        $rootScope.$broadcast("notification" ,response);  
                      };
                      
                      
      
                    }, function(response) {
                      
                      //DEMO FAIL RESPONSE
                        //create DEMO response
                      response = {recognizedDevice : { vendor:"on plus",model:"one"}};
                      for (var i = pluginParams.Recognize.attempts - 1; i >= 0; i--) {
                        if (i == 0)
                          response = {recognizedDevice : true};
                        $rootScope.$broadcast("notification" ,response);  
                      };

                    });
            }

      return this;
    }

return { 
  newMCE : function() {
    return new MCE(); 
  }
}
}).controller('MenuCtrl', 
function($scope, $http , MCE){
$scope.pluginResult = {};

  var mce = MCE.newMCE();

  var Recognize = {"Recognize" : {usbPort:"COM1",attempts:2} };
  var usbResult = false;

//when reciving notification broadcast and recognizedDevice is not undefined
  $scope.$on("notification" , function(evt , data ){
    if (data.recognizedDevice != undefined) {
        handeleRecognizedDevice(data);  
    }  
  });

  mce.run(Recognize);

function handeleRecognizedDevice(notification) { 
     //enter when vandor and moel has value 
     if  (notification.recognizedDevice.vendor && notification.recognizedDevice.model) { 
        usbResult = notification.recognizedDevice;
     }
     //enter when recognizedDevice object is not undefined
     else if (notification.recognizedDevice) {
      //enter when usbResult not false
       if (usbResult) { 
        $scope.pluginResult = usbResult;
      }
      else { 
        $scope.pluginResult =  "The recognition has failed. Bummer!";
      }
    }
    else { 
     $scope.pluginResult =  "The recognition has failed. Bummer!";
   }
  }
});


