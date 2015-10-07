(function () {
    'use strict';

    angular.module('mainApp').controller('LoginCtrl', ['$scope','$firebaseAuth', '$firebaseObject', 'auth_service', '$location', 'domain',
        function($scope, $firebaseAuth, $firebaseObject, auth_service, $location, domain) {
            $scope.auth = auth_service.get_auth_object();
            var root_ref = new Firebase(domain);
                        
            $scope.settings = function() {
            };
            
            $scope.dashboard = function() {
                $location.path('dashboard');
            };
            
            $scope.profile = function() {
                $location.path('sign_up');
            };
            
            auth_service.set_signup_func(function() {
                $scope.profile();
            });
            
            $scope.open_auth_modal  = auth_service.open_auth_modal;
            $scope.logout = function() {
                $location.path('trainers');
                auth_service.logout();
            }
        }]);
})();

