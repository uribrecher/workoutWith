(function () {
    'use strict';

    angular.module('mainApp').controller('BookingCtrl', 
                       ['$scope', '$routeParams', '$firebaseObject', '$firebaseArray', '$location', 'domain', 'auth_service',
       function ($scope, $routeParams, $firebaseObject, $firebaseArray, $location, domain, auth_service) {

           $scope.master_meeting = 
                        {
                            "trainer_id": $routeParams.id,
                            "trainee_id": "invalid",
                            "location": "abc",
                            "workout": "abc",
                            "trainer_feedback": {
                                "rating": 0,
                                "details": "fill in"
                            },
                            "trainee_feedback": {
                                "rating": 0,
                                "details": "fill in"
                            }
                        };
           
           var root_ref = new Firebase(domain);
           var trainer_ref = root_ref.child("trainers").child($scope.master_meeting.trainer_id);
           var meetings_ref = root_ref.child("meetings");

           $scope.trainer = $firebaseObject(trainer_ref);
           $scope.meetings = $firebaseArray(meetings_ref);

           $scope.form_date = new Date();
           $scope.form_time = new Date();
           
           $scope.auth = auth_service.get_auth_object();
           $scope.auth.$onAuth(function(authdata) { 
                if (authdata) {
                    $scope.master_meeting.trainee_id = authdata.uid;
                    $scope.meeting = angular.copy($scope.master_meeting);
                    
                    var trainee_ref = root_ref.child("users").child(authdata.uid);
                    $scope.trainee = $firebaseObject(trainee_ref);
                }
            });
           
           $scope.create_meeting = function() {
                var authdata = $scope.auth.$getAuth();
                if (!authdata) {
                    auth_service.open_auth_modal();
                }
                var start_time = new Date($scope.form_date.getYear(),
                                        $scope.form_date.getMonth(),
                                        $scope.form_date.getDate(),
                                        $scope.form_time.getHours(),
                                        $scope.form_time.getMinutes(),
                                        $scope.form_time.getSeconds(),
                                        0);
                var end_time = start_time;
                end_time.setHours(end_time.getHours() + 1);
               
                $scope.meeting.start = start_time.toISOString();
                $scope.meeting.end   = end_time.toISOString();
                $scope.meetings.$add($scope.meeting).then(function(ref) {
                    //var debug = ref.key();
                    $location.path('/review/' + ref.key());
                });
           }
    }]);
})();

