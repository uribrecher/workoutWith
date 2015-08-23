
(function () {
    'use strict';

    var domain = "https://workshopwith.firebaseio.com";
    var mainApp = angular.module('mainApp', ['ngRoute', 'firebase', 'ui.bootstrap']);

    mainApp.run(["$rootScope", "$location", function($rootScope, $location) {
        $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/trainers");
            }
        });
    }]);
    
    mainApp.factory("Auth", ['$firebaseAuth',
        function($firebaseAuth) {
            var ref = new Firebase(domain);
            return $firebaseAuth(ref);
        }]);
    
    mainApp.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider.
          when('/trainers', {
            templateUrl: 'html/trainers.html',
            controller: 'TrainersListCtrl'
          }).
          when('/trainers/:id', {
            templateUrl: 'html/trainer_details.html',
            controller: 'TrainerDetailCtrl'
          }).
          when('/book/:id', {
            templateUrl: 'html/booking.html',
            controller: 'BookingCtrl',
            resolve: {
                "currentAuth": ["Auth", function(Auth) {
                    return Auth.$requireAuth();
                }]
            }
          }).
          when('/review/:id', {
            templateUrl: 'html/review.html',
            controller: 'ReviewCtrl'
          }).
          otherwise({
            redirectTo: '/trainers'
          });
      }]);

    mainApp.controller('NavCtrl', ['$scope','$firebaseAuth', 'Auth',
        function($scope, $firebaseAuth, Auth) {
            $scope.auth = Auth;
            
            $scope.auth.$onAuth(function(authdata) {
                $scope.authdata = authdata;
                if (authdata)
                {
                    $scope.avatar = authdata.google.profileImageURL;
                    $scope.username = authdata.google.displayName;
                }
            });
       
            $scope.login = function(provider_name) {
                // TODO: open modal and choose google or facebook
                $scope.auth.$authWithOAuthPopup(provider_name,{scope:"email"});
            };
        
            $scope.logout = function() {
                $scope.auth.$unauth();
            };
        
        }]);

    mainApp.controller('TrainerDetailCtrl', ['$scope', '$routeParams', '$firebaseObject', '$firebaseArray' ,
      function($scope, $routeParams, $firebaseObject, $firebaseArray) {
          var ref = new Firebase(domain + "/trainers/" + $routeParams.id);
          var meetings_ref = new Firebase(domain + "/meetings/");
          var trainees_ref = new Firebase(domain + "/trainees/");
          $scope.trainer = $firebaseObject(ref);
          $scope.reviews = $firebaseArray(meetings_ref.orderByChild("trainer_id").equalTo($routeParams.id));
          $scope.trainees = $firebaseArray(trainees_ref);

          $scope.get_trainee_object = function(trainee_id) {
              return $scope.trainees.$getRecord(trainee_id);
          };

      }]);

    mainApp.controller('TrainersListCtrl', 
                       ['$scope', '$firebaseArray',
       function ($scope, $firebaseArray) {
          var ref = new Firebase(domain + "/trainers");
          $scope.trainers = $firebaseArray(ref);
    }]);


    mainApp.controller('BookingCtrl', 
                       ['$scope', '$routeParams', '$firebaseObject', '$firebaseArray', '$location',
       function ($scope, $routeParams, $firebaseObject, $firebaseArray, $location) {

           $scope.master_meeting = 
                        {
                            "trainer_id": $routeParams.id,
                            "trainee_id": "103",
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
           $scope.meeting = angular.copy($scope.master_meeting);

           var ref = new Firebase(domain + "/trainers/" + $scope.master_meeting.trainer_id);
           var meetings_ref = new Firebase(domain + "/meetings");
           var trainee_ref = new Firebase(domain + "/trainees" + $scope.master_meeting.trainee_id);


           $scope.trainer = $firebaseObject(ref);
           $scope.trainee = $firebaseObject(trainee_ref);
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
                    var debug = ref.key();
                    $location.path('/review/' + ref.key());
                });
           }
    }]);

    mainApp.controller('ReviewCtrl', 
                       ['$scope', '$routeParams', '$firebaseObject', '$firebaseArray', '$location',
       function ($scope, $routeParams, $firebaseObject, $firebaseArray, $location) {

           var meeting_ref = new Firebase(domain + "/meetings").child($routeParams.id);
           var meeting = $firebaseObject(meeting_ref);
           meeting.$bindTo($scope,"meeting");

           meeting.$loaded().then(function(data) {
               var trainer_ref = new Firebase(domain + "/trainers").child(data.trainer_id);
               var trainee_ref = new Firebase(domain + "/trainees").child(data.trainee_id);

               $scope.trainer = $firebaseObject(trainer_ref);
               $scope.trainee = $firebaseObject(trainee_ref);       
           });

           $scope.create_review = function() {
               $location.path('/trainers');
           }
    }]);
})();

