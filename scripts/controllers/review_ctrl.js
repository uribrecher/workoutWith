(function () {
    'use strict';
 
    angular.module('mainApp').controller('ReviewCtrl', 
                       ['$scope', '$routeParams', '$firebaseObject', '$location',
                        'domain',
       function ($scope, $routeParams, $firebaseObject, $location, domain) {

           var root_ref = new Firebase(domain);
           var reviews_ref = new Firebase(domain).child("reviews");
           $scope.reviews = $firebaseObject(reviews_ref);
           
           $scope.review = {
               "sess_id": $routeParams.id,
               "rating": 0,
               "text": "fill in"
           };
           $scope.reviews = $firebaseObject(reviews_ref);

           /*$scope.meeting.$loaded().then(function(data) {
               var trainer_ref = new Firebase(domain + "/trainers").child(data.trainer_id);
               var trainee_ref = new Firebase(domain + "/trainees").child(data.trainee_id);

               $scope.trainer = $firebaseObject(trainer_ref);
               $scope.trainee = $firebaseObject(trainee_ref);       
           });*/

           $scope.create_review = function() {
               reviews.$add($scope.review);
               $location.path('/trainers');
           }
    }]);
})();
