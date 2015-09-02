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
                            "workout": "",
                            "trainer_feedback": {
                                "rating": 0,
                                "details": "fill in"
                            },
                            "trainee_feedback": {
                                "rating": 0,
                                "details": "fill in"
                            }
                        };
           
           $scope.auth = auth_service.get_auth_object();
           $scope.auth.$onAuth(function(authdata) { 
                if (authdata) {
                    $scope.master_meeting.trainee_id = authdata.uid;
                    $scope.meeting = angular.copy($scope.master_meeting);
                    
                    var trainee_ref = new Firebase(domain + "/trainees" + authdata.uid);
                    $scope.trainee = $firebaseObject(trainee_ref);
                }
            });
           
           
           var ref = new Firebase(domain + "/trainers/" + $scope.master_meeting.trainer_id);
           var meetings_ref = new Firebase(domain + "/meetings");


           $scope.trainer = $firebaseObject(ref);
           $scope.meetings = $firebaseArray(meetings_ref);

           $scope.form_date = new Date();
           $scope.form_time = new Date();

           $scope.create_meeting = function() {
                $scope.meeting.start = new Date($scope.form_date.getYear(),
                                        $scope.form_date.getMonth(),
                                        $scope.form_date.getDate(),
                                        $scope.form_time.getHours(),
                                        $scope.form_time.getMinutes(),
                                        $scope.form_time.getSeconds(),
                                        0);
                $scope.meeting.end = new Date($scope.meeting.start + new Date(0,0,0,1,0,0,0));                    
                $scope.meetings.$add($scope.meeting).then(function(ref) {
                    //var debug = ref.key();
                    $location.path('/review/' + ref.key());
                });
           }
    }]);
})();

