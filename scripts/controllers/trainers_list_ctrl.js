(function () {
    'use strict';

    angular.module('mainApp').controller('TrainersListCtrl', 
                       ['$scope', '$firebaseArray', 'domain',
       function ($scope, $firebaseArray, domain) {
           var root_ref = new Firebase(domain);
           var trainers_ref = root_ref.child("trainers");
           var users_ref = root_ref.child("users_public");

           $scope.trainers = $firebaseArray(trainers_ref);
           $scope.public_users = $firebaseArray(users_ref);

           $scope.jumbo_image = "http://www.nathaliarenefitness.com/wp-content/uploads/2014/05/Nathalia.Rene_.Fitness.banner1.jpg";
           
           $scope.update_search = function() {
           };
    }]);
})();
