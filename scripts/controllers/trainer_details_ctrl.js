(function () {
    'use strict';

    angular.module('mainApp').controller('TrainerDetailCtrl', 
                                         ['$scope', '$routeParams', '$firebaseObject', '$firebaseArray' ,
                                          'domain',
      function($scope, $routeParams, $firebaseObject, $firebaseArray,domain) {
          
          var root_ref = new Firebase(domain);
          var trainer_ref = root_ref.child("trainers").child($routeParams.id);
          $scope.trainer = $firebaseObject(trainer_ref);          
          $scope.public_trainer_data = $firebaseObject(root_ref.child("users_public").child($routeParams.id));
          
          // TODO: add reviews data here
          //var meetings_ref = root_ref.child("meetings");
          //$scope.reviews = $firebaseArray(meetings_ref.orderByChild("trainer_id").equalTo($routeParams.id));
      }]);
})();
