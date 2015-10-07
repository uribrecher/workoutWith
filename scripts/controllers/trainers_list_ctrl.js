(function () {
    'use strict';

    angular.module('mainApp').controller('TrainersListCtrl', 
                       ['$scope', '$firebaseArray', 'domain', 'auth_service',
       function ($scope, $firebaseArray, domain, auth_service) {
           var root_ref = new Firebase(domain);
           var trainers_ref = root_ref.child("trainers");
           var users_ref = root_ref.child("users_public");

           $scope.trainers = $firebaseArray(trainers_ref);
           $scope.public_users = $firebaseArray(users_ref);
           $scope.user = auth_service.get_fb_user();

           $scope.jumbo_image = "http://www.nathaliarenefitness.com/wp-content/uploads/2014/05/Nathalia.Rene_.Fitness.banner1.jpg";
           
           $scope.update_search = function() {
           };
    }]);
})();
