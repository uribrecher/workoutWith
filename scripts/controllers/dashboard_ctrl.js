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
          $scope.trainer_selection = {
              session_ids: {
              },
              count: 0
          };
          $scope.items = {
          };
          $scope.trainer_items = {
          };
          $scope.traine_items_count = 0;
          
          $scope.select_all;
          $scope.trainer_select_all;
          
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

              session_service.get_all_sessions_of_trainer(authData.uid, function(session_id, session_obj) {
                  $scope.trainer_selection.session_ids[session_id] = false;
                  $scope.trainer_items[session_id] = session_obj;
                  $scope.trainer_selection.count += 1;
              },
              function(session_id) {
                  delete $scope.trainer_selection.session_ids[session_id];
                  delete $scope.trainer_items[session_id];
                  $scope.trainer_selection.count -= 1;
              });
          
          });
          
          $scope.check_all = function() {
              angular.forEach($scope.selection.session_ids, function(selected, session_id) {
                  $scope.selection.session_ids[session_id] = $scope.select_all;
              });
          }

          $scope.trainer_check_all = function() {
              angular.forEach($scope.trainer_selection.session_ids, function(selected, session_id) {
                  $scope.trainer_selection.session_ids[session_id] = $scope.select_all;
              });
          }
          
          $scope.cancel_selected = function() {
              for (var session_id in $scope.selection.session_ids) {
                  if ($scope.selection.session_ids[session_id]) {
                      session_service.cancel_session_request(session_id);
                  }
              }
            
          };
          
          $scope.confirm_selected = function() {
              for (var session_id in $scope.trainer_selection.session_ids) {
                  if ($scope.trainer_selection.session_ids[session_id]) {
                      session_service.confirm_session_request(session_id);
                  }
              }
            
          };

          $scope.reject_selected = function() {
              for (var session_id in $scope.trainer_selection.session_ids) {
                  if ($scope.trainer_selection.session_ids[session_id]) {
                      session_service.reject_session_request(session_id);
                  }
              }
            
          };
          
      }]);
})();
