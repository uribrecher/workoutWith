(function () {
    'use strict';

    angular.module('mainApp').controller('DashboardCtrl', 
                                         ['$scope', '$firebaseObject', '$firebaseArray' ,
                                          'domain', 'auth_service','session_service',
      function($scope, $firebaseObject, $firebaseArray,domain, auth_service, session_service) {
          $scope.auth = auth_service.get_auth_object();
          
          var root_ref = new Firebase(domain);
          var users_ref = root_ref.child("users_public");
          $scope.users = $firebaseArray(users_ref);
          $scope.user = auth_service.get_fb_user();
          $scope.selection = {
              session_ids: {
              }
          };
          $scope.items = {
          };
          
          $scope.select_all;
          
          // TODO: try to avoid this direct usage of auth object
          $scope.auth.$onAuth(function(authData) {
              if (!authData) {
                  return;
              }
              
              session_service.get_all_sessions_of_trainee(authData.uid, function(session_id, session_obj) {
                  $scope.selection.session_ids[session_id] = false;
                  $scope.items[session_id] = session_obj;
              },
              function(session_id) {
                  delete $scope.selection.session_ids[session_id];
                  delete $scope.items[session_id];
              });
          });
          
          $scope.check_all = function() {
              angular.forEach($scope.selection.session_ids, function(selected, session_id) {
                  $scope.selection.session_ids[session_id] = $scope.select_all;
              });
          }
          
          $scope.cancel_selected = function() {
              for (var session_id in $scope.selection.session_ids) {
                  if ($scope.selection.session_ids[session_id]) {
                      session_service.cancel_session_request(session_id);
                  }
              }
            
          };
      }]);
})();
