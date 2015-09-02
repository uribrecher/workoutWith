
(function () {
    'use strict';

    var mainApp = angular.module('mainApp', ['ngRoute', 'firebase', 'ui.bootstrap']);

    mainApp.constant("domain", "https://workshopwith.firebaseio.com");
    
    function auth_service($firebaseAuth, $firebaseArray, $modal, domain) {
        var ref = new Firebase(domain);
        var fb_auth = $firebaseAuth(ref);
        this.login = function (provider_name) {
            fb_auth.$authWithOAuthPopup(provider_name, {scope: "email"});
        };
        this.logout = function () {
            fb_auth.$unauth();
        };
        
        this.get_auth_object = function () {
            return fb_auth;
        };
        this.open_auth_modal = function () {
            var modalInstance = $modal.open(
                {
                    animation: true,
                    templateUrl: 'html/login_dialog.html',
                    controller: 'AuthModalCtrl',
                    size: 'sm'
                });    
        };
        
        
        this.add_user = function(uid, user_object) {
            var user_ref = new Firebase(domain).child("users").child(uid);
            user_ref.transaction(function(current_data) {
                if (current_data === null) {
                    return user_object;
                }
                else {
                    console.log('user ' + uid + ' already exists');
                    return;
                }
            }, function(error,committed,snapshot) {
                if (error) {
                    console.log('add_uaer transaction failed abnormally!', error);
                } else if (!committed) {
                    console.log('user already exists, transaction aborted');
                } else {
                    console.log('User added!');
                }
                console.log("user's data: ", snapshot.val());
            });
        };
    };
    
    mainApp.service("auth_service", ['$firebaseAuth', '$firebaseArray', '$modal', 'domain', auth_service]);
  
    mainApp.directive('backgroundImageDirective', function () {
        return function (scope, element, attrs) {
            element.css({
                'background-image': 'url(' + attrs.backgroundImageDirective + ')',
                'background-repeat': 'no-repeat',
                'background-position': 'center',
                'background-attachment': 'scroll',
                'background-size': 'cover',
                'min-height': attrs.minHeight
            });
        };
    });
    
    mainApp.run(["$rootScope", "$location", "auth_service",
        function($rootScope, $location, auth_service) {
            $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
                // We can catch the error thrown when the $requireAuth promise is rejected
                // and redirect the user back to the home page
                if (error === "AUTH_REQUIRED") {
                    auth_service.open_auth_modal();
                }
        });
    }]);
    
    
    mainApp.config(['$routeProvider', '$locationProvider',
      function($routeProvider, $locationProvider) {
        
          var require_auth = {
                "currentAuth": ["auth_service", function(auth_service) {
                    return auth_service.get_auth_object().$requireAuth();
                }]
          };

          var wait_for_auth = {
                "currentAuth": ["auth_service", function(auth_service) {
                    return auth_service.get_auth_object().$waitForAuth();
                }]
          };

          
        $locationProvider.html5Mode(true);  
        $routeProvider.
          when('/trainers', {
            templateUrl: 'html/trainers.html',
            controller: 'TrainersListCtrl',
            resolve: wait_for_auth
          }).
          when('/sign_up', {
            templateUrl: 'html/sign_up.html',
            controller: 'SignUpCtrl',
            resolve: wait_for_auth
          }).
          when('/create_trainer', {
            templateUrl: 'html/trainer_form.html',
            controller: 'TrainerFormCtrl',
            resolve: require_auth
          }).
          when('/trainers/:id', {
            templateUrl: 'html/trainer_details.html',
            controller: 'TrainerDetailCtrl',
            resolve: wait_for_auth
          }).
          when('/book/:id', {
            templateUrl: 'html/booking.html',
            controller: 'BookingCtrl',
            resolve: require_auth
          }).
          when('/review/:id', {
            templateUrl: 'html/review.html',
            controller: 'ReviewCtrl',
            resolve: require_auth
          }).
          otherwise({
            redirectTo: 'trainers'
          });
      }]);

})();

