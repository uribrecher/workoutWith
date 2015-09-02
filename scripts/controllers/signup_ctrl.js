(function () {
    'use strict';

    angular.module('mainApp').controller('SignUpCtrl', 
                       ['$scope', '$firebaseObject', '$firebaseArray', '$location', 'auth_service',
                        'domain',
       function ($scope, $firebaseObject, $firebaseArray, $location, auth_service, domain) {

            var users_ref = new Firebase(domain + "/users");
            var users_array = $firebaseArray(users_ref);
 
            $scope.user = {
                "email" : "email",
                "name" : "user name",
                "birthday" : new Date(),
                "avatar" : "http://mixakids.com/assets/images/default_F.png"
            };
            $scope.auth = auth_service.get_auth_object();
            
            $scope.auth.$onAuth(function(authdata) { 
                if (authdata) {
                    $scope.uid = authdata.uid;
                    $scope.user.email = authdata.google.email;
                    $scope.user.name = authdata.google.displayName;
                    $scope.user.avatar = authdata.google.profileImageURL ;
                }
            });

            $scope.submit = function() {
                auth_service.add_user($scope.uid, $scope.user);
            };
           
    }]);
})();
