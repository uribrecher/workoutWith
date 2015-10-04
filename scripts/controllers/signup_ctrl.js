(function () {
    'use strict';

    angular.module('mainApp').controller('SignUpCtrl', 
                       ['$scope', '$firebaseObject', '$firebaseArray', '$location', 'auth_service',
                        'domain',
       function ($scope, $firebaseObject, $firebaseArray, $location, auth_service, domain) {
           
           var root_ref = new Firebase(domain);
           $scope.birthday = new Date();;
           
           /*
           $scope.auth = auth_service.get_auth_object();
           $scope.auth.$onAuth(function(authdata) {
               if (!authdata) {
                   return;
               }
               
               var uid = authdata.uid;
               uid = "00201";
               var public_user_ref = root_ref.child('users_public').child(uid);
               var private_user_ref = root_ref.child('users_private').child(uid);

               $scope.user = {
                   private: $firebaseObject(private_user_ref),
                   public: $firebaseObject(public_user_ref)
               };
               
               var public_user_ref = root_ref.child('users_public').child($scope.authdata.uid);
               var private_user_ref = root_ref.child('users_private').child($scope.authdata.uid);

               private_user_ref.transaction(function(private_user_data) {
                   if (private_user_data && private_user_data.registered) {
                       $scope.birthday = new Date(private_user_data.birthday);
                       return; // abort transaction
                   }
                   $scope.birthday = new Date();

                   return {
                       email: auth_service.get_email($scope.authdata),
                       gender: "male",
                       birthday: new Date().toISOString(),
                       registered: true
                   };
               });
               
               public_user_ref.transaction(function(public_user_data) {
                   if (public_user_data && public_user_data.name) {
                       return; // abort
                   }
                   
                   return {
                       name: auth_service.get_display_name($scope.authdata),
                       avatar: auth_service.get_avatar($scope.authdata)
                   };
               });
               
           });
           */
           
           $scope.update_user = function(valid_form) {
               if (!valid_form)
               {
                   return;
               }
               
               $scope.user.private.registered = true;
               $scope.user.private.birthday = $scope.birthday.toISOString();
               $scope.user.public.$save();
               $scope.user.private.$save().then(function(ref) {
                   $location.path('trainers');
               }, function(error) {
                   console.log(error);
               });
           };
           
    }]);
})();
