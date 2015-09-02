(function () {
    'use strict';

    angular.module('mainApp').controller('TrainerDetailCtrl', 
                                         ['$scope', '$routeParams', '$firebaseObject', '$firebaseArray' ,
                                          'domain',
      function($scope, $routeParams, $firebaseObject, $firebaseArray,domain) {
          var ref = new Firebase(domain + "/trainers/" + $routeParams.id);
          var meetings_ref = new Firebase(domain + "/meetings/");
          var trainees_ref = new Firebase(domain + "/trainees/");
          $scope.trainer = $firebaseObject(ref);
          $scope.trainer_loaded = false;
          
          $scope.trainer.$loaded(function() {
            $scope.trainer_loaded = true;
          });
          
          $scope.reviews = $firebaseArray(meetings_ref.orderByChild("trainer_id").equalTo($routeParams.id));
          $scope.trainees = $firebaseArray(trainees_ref);

          $scope.get_trainee_object = function(trainee_id) {
              return $scope.trainees.$getRecord(trainee_id);
          };
      }]);
})();
