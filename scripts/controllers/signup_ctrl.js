(function () {
    'use strict';

    angular.module('mainApp').controller('SignUpCtrl', 
                       ['$scope', '$firebaseObject', '$firebaseArray', '$location', 'auth_service',
                        'domain',
       function ($scope, $firebaseObject, $firebaseArray, $location, auth_service, domain) {
           
           var root_ref = new Firebase(domain);
           $scope.birthday = new Date();;
           $scope.user = auth_service.get_fb_user();
           
           $scope.update_user = function(valid_form) {
               if (!valid_form)
               {
                   return;
               }
 
               $scope.user.private.registered = true;
               $scope.user.private.birthday = $scope.birthday.toISOString();
 
               auth_service.update_user().then(function() {
                   $location.path('trainers');
               });
           };
           
    }]);
})();
