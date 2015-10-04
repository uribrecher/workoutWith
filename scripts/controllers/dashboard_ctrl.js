(function () {
    'use strict';

    angular.module('mainApp').controller('DashboardCtrl', 
                                         ['$scope', '$firebaseObject', '$firebaseArray' ,
                                          'domain', 'auth_service',
      function($scope, $firebaseObject, $firebaseArray,domain, auth_service) {
          $scope.auth = auth_service.get_auth_object();
          
          var root_ref = new Firebase(domain);
          var users_ref = root_ref.child("users_public");
          $scope.users = $firebaseArray(users_ref);
          
          $scope.auth.$onAuth(function(authData) {
              if (!authData) {
                  return;
              }
              var sessions_ref = root_ref.child('sessions').child(authData.uid);
              $scope.sessions = $firebaseArray(sessions_ref);
          });
      }]);
})();
