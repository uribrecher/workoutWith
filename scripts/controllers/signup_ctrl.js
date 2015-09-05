(function () {
    'use strict';

    angular.module('mainApp').controller('SignUpCtrl', 
                       ['$scope', '$firebaseObject', '$firebaseArray', '$location', 'auth_service',
                        'domain',
       function ($scope, $firebaseObject, $firebaseArray, $location, auth_service, domain) {
           $scope.auth = auth_service.get_auth_object();
           var authdata = $scope.auth.$getAuth();
           
           if (authdata) {
               var user_ref = new Firebase(domain).child('users').child(authdata.uid);
               $scope.user = $firebaseObject(user_ref);
               
               $scope.user_loaded = false;
          
               $scope.user.$loaded(function() {
                  $scope.user_loaded = true;
               });
          
               
               $scope.user.$loaded().then(function(userdata) {
                    if (!userdata.birthday) {
                        userdata.birthday = new Date().toISOString();
                    } else {
                        $scope.birthday = new Date(userdata.birthday);
                    }
                    if (!userdata.gender) {
                        userdata.gender = "invalid";
                    }
               });
               
           }
           
           $scope.submit = function() {
               $scope.user.registered = true;
               $scope.user.birthday = $scope.birthday.toISOString();
               $scope.user.$save().then(function(ref) {
                   $location.path('trainers');
               }, function(error) {
                   console.log(error);
               });
           };
           
    }]);
})();
