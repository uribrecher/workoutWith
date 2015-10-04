(function () {
    'use strict';

    angular.module('mainApp').controller('BookingCtrl',
                       ['$scope', '$routeParams', '$firebaseObject', '$firebaseArray', '$location', 'domain', 'auth_service', 'session_service',
        function ($scope, $routeParams, $firebaseObject, $firebaseArray, $location, domain, auth_service, session_service) {
           
            var root_ref = new Firebase(domain);
            var trainer_ref = root_ref.child("trainers").child($routeParams.id);
            var session_ref = root_ref.child("sessions");

            $scope.trainer = $firebaseObject(trainer_ref);
            //$scope.sessions = $firebaseArray(session_ref);


            $scope.form_date = new Date();
            
            $scope.form_time = new Date();
            $scope.form_time.setMilliseconds(0);
            $scope.form_time.setSeconds(0);
            $scope.form_time.setMinutes(0);
            
            $scope.form_workout = "none";
            $scope.send_session_request = function() {
                if (!$scope.authdata) {
                    auth_service.open_auth_modal();
                    return;
                }
                $scope.trainee_id = $scope.authdata.uid;
                
                var start_time = new Date($scope.form_date.getFullYear(),
                                          $scope.form_date.getMonth(),
                                          $scope.form_date.getDate(),
                                          $scope.form_time.getHours(),
                                          $scope.form_time.getMinutes(),
                                          0,0);
                
                //var end_time = angular.copy(start_time);
                //end_time.setHours(end_time.getHours() + 1);
                
                session_service.send_session_request($scope.authdata.uid, $routeParams.id, start_time.toISOString(), "1");
            }
        }]);
})();

