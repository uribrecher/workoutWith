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
            
            $scope.auth.$onAuth(function(authdata) {
                $scope.authdata = authdata;
                if (authdata)
                {                   
                    var public_user_ref = root_ref.child("users_public").child($scope.authdata.uid);
                    var private_user_ref = root_ref.child("users_private").child($scope.authdata.uid);
                    $scope.user = {
                        private: $firebaseObject(private_user_ref),
                        public: $firebaseObject(public_user_ref)
                    }
                    
                    // fill some default values from the authdata when necessary
                    $scope.user.public.name = ($scope.user.public.name === undefined) ? auth_service.get_display_name($scope.authdata) : $scope.user.public.name; 
                    $scope.user.public.avatar = ($scope.user.public.avatar === undefined) ? auth_service.get_avatar($scope.authdata) : $scope.user.public.avatar; 
                    $scope.user.private.email = ($scope.user.private.email === undefined) ? auth_service.get_email($scope.authdata) : $scope.user.private.email; 
                    
                    private_user_ref.child("registered").on("value", function(snap) {
                        if (snap.val() === null) {
                            $scope.profile();
                        }
                    });
                }
            });
            
            $scope.open_auth_modal  = auth_service.open_auth_modal;
            $scope.logout = function() {
                $location.path('trainers');
                auth_service.logout();
            }
        }]);
})();

