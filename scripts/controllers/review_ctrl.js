(function () {
    'use strict';
 
    angular.module('mainApp').controller('ReviewCtrl', 
                       ['$scope', '$routeParams', '$firebaseObject', '$location',
                        'domain',
       function ($scope, $routeParams, $firebaseObject, $location, domain) {

           var meeting_ref = new Firebase(domain + "/meetings").child($routeParams.id);
           var meeting = $firebaseObject(meeting_ref);
           meeting.$bindTo($scope,"meeting");

           meeting.$loaded().then(function(data) {
               var trainer_ref = new Firebase(domain + "/trainers").child(data.trainer_id);
               var trainee_ref = new Firebase(domain + "/trainees").child(data.trainee_id);

               $scope.trainer = $firebaseObject(trainer_ref);
               $scope.trainee = $firebaseObject(trainee_ref);       
           });

           $scope.create_review = function() {
               $location.path('/trainers');
           }
    }]);
})();
