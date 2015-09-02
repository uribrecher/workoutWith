(function () {
    'use strict';

    angular.module('mainApp').controller('LoginCtrl', ['$scope','$firebaseAuth', '$firebaseObject', 'auth_service', '$location', 'domain',
        function($scope, $firebaseAuth, $firebaseObject, auth_service, $location, domain) {
            $scope.auth = auth_service.get_auth_object();
            
            $scope.auth.$onAuth(function(authdata) {
                $scope.authdata = authdata;
                if (authdata)
                {
                    $scope.avatar = authdata.google.profileImageURL;
                    $scope.username = authdata.google.displayName;
                    
                    var user_ref = new Firebase(domain).child("users").child(authdata.uid);
                    user_ref.once("value", function(snapshot) {
                        if (!snapshot.exists()) {
                            $location.path('sign_up');
                        }
                    });
                }
                else
                {
                    $location.path('trainers');
                }
            });

           
            $scope.open_auth_modal  = auth_service.open_auth_modal;
            $scope.logout = auth_service.logout;
        }]);
})();

