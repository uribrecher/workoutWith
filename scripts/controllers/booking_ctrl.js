(function () {
    'use strict';

    angular.module('mainApp').controller('BookingCtrl',
                       ['$scope', '$routeParams', '$firebaseObject', '$firebaseArray', '$location', 'domain', 'auth_service', 'session_service',
        function ($scope, $routeParams, $firebaseObject, $firebaseArray, $location, domain, auth_service, session_service) {
           
            var root_ref = new Firebase(domain);
            var trainer_ref = root_ref.child("trainers").child($routeParams.id);
            var session_ref = root_ref.child("sessions");

            $scope.user = auth_service.get_fb_user();
            $scope.trainer = $firebaseObject(trainer_ref);
            $scope.form_date = new Date();
            $scope.form_time = new Date();
            $scope.form_time.setMilliseconds(0);
            $scope.form_time.setSeconds(0);
            $scope.form_time.setMinutes(0);
            
            $scope.form_workout = "none";
            $scope.send_session_request = function(valid) {
                if (!valid) {
                    return;
                }
                
                if (!$scope.user.uid) {
                    auth_service.open_auth_modal();
                    return;
                }
                $scope.trainee_id = $scope.user.uid;
                
                var start_time = new Date($scope.form_date.getFullYear(),
                                          $scope.form_date.getMonth(),
                                          $scope.form_date.getDate(),
                                          $scope.form_time.getHours(),
                                          $scope.form_time.getMinutes(),
                                          0,0);
                              
                session_service.send_session_request($scope.user.uid, 
                                                     $routeParams.id, 
                                                     start_time.toISOString(),
                                                     $scope.form_workout).then(
                    function() {
                        $location.path('trainers');
                    });
                
            }
        }]);
})();

