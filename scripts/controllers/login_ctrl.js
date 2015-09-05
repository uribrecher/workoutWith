(function () {
    'use strict';

    angular.module('mainApp').controller('LoginCtrl', ['$scope','$firebaseAuth', '$firebaseObject', 'auth_service', '$location', 'domain',
        function($scope, $firebaseAuth, $firebaseObject, auth_service, $location, domain) {
            $scope.auth = auth_service.get_auth_object();
            
            $scope.auth.$onAuth(function(authdata) {
                $scope.authdata = authdata;
                if (authdata)
                {                   
                    var user_ref = new Firebase(domain).child("users").child(authdata.uid);
                    $scope.user = $firebaseObject(user_ref);
                    
                    $scope.user.$loaded().then(function (user_data) {
                        user_data.name = auth_service.get_display_name(authdata);
                        user_data.email = auth_service.get_email(authdata);                    
                        user_data.avatar = auth_service.get_avatar(authdata);
                        user_data.birthday = "1977-06-10T01:01:01.001Z"
                        
                        user_data.$save().then(function(ref) {
                            if (!user_data.registered) {
                                $location.path('sign_up');
                            }
                        });
                    });
                }
                
            });

            $scope.settings = function() {
            };
            
            $scope.dashboard = function() {
            };
            
            $scope.profile = function() {
                $location.path('sign_up');
            };
            
            $scope.open_auth_modal  = auth_service.open_auth_modal;
            $scope.logout = auth_service.logout;
        }]);
})();

