(function () {
    'use strict';

    angular.module('mainApp').controller('TrainerRegCtrl', 
                                         ['$scope', '$firebaseObject', '$firebaseArray' ,
                                          'domain', 'auth_service','session_service', '$location',
      function($scope, $firebaseObject, $firebaseArray,domain, auth_service, session_service, $location) {
          $scope.auth = auth_service.get_auth_object();
          
          var root_ref = new Firebase(domain);
          var users_ref = root_ref.child("users_public");
          var workout_types_ref = root_ref.child("read-only").child("workout");
          
          
          $scope.workout_types = $firebaseObject(workout_types_ref);
          $scope.user = auth_service.get_fb_user();
          $scope.form_location = $scope.user.trainer.location;
          
          workout_types_ref.on("child_added", function(snap) {
              $scope.user.trainer.$ref().child('prices').child(snap.key()).transaction(function(price_snap) {
                  if (price_snap === null) {
                      return 0.0;
                  }
                  
                  return;
              });
          });
                    
          $scope.update_trainer = function(valid_form) {
              if (!valid_form)
              {
                  return;
              }
  
              auth_service.update_trainer().then(function() {
                   $location.path('trainers');
              });
          };
          
          $scope.add_price = function() {
              
          }
          
          $scope.remove_price = function() {
          }
      }]);
})();
