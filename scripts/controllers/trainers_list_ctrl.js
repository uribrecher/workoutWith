(function () {
    'use strict';

    angular.module('mainApp').controller('TrainersListCtrl', 
                       ['$scope', '$firebaseArray', 'domain',
       function ($scope, $firebaseArray, domain) {
          var ref = new Firebase(domain + "/trainers");
          $scope.trainers = $firebaseArray(ref);
           
          $scope.jumbo_image = "http://www.nathaliarenefitness.com/wp-content/uploads/2014/05/Nathalia.Rene_.Fitness.banner1.jpg";
    }]);
})();
