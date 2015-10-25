
(function () {
    'use strict';

    var mainApp = angular.module('mainApp', ['ngRoute', 'firebase', 'ui.bootstrap', 'ngAutocomplete']);

    mainApp.constant("domain", "https://workshopwith.firebaseio.com");
    
    mainApp.directive('backgroundImageDirective', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                    element.css({
                        'background-image': 'url(' + attrs.backgroundImageDirective + ')',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center',
                        'background-attachment': 'scroll',
                        'background-size': 'cover',
                        'min-height': attrs.minHeight
                    });
            }
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
            
            auth_service.init();
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
          when('/dashboard', {
            templateUrl: 'html/dashboard.html',
            controller: 'DashboardCtrl',
            resolve: require_auth
          }).
          when('/trainers/:id', {
            templateUrl: 'html/trainer_details.html',
            controller: 'TrainerDetailCtrl',
            resolve: wait_for_auth
          }).
          when('/review/:id', {
            templateUrl: 'html/review.html',
            controller: 'ReviewCtrl',
            resolve: require_auth
          }).
          when('/trainer_register', {
            templateUrl: 'html/trainer_reg.html',
            controller: 'TrainerRegCtrl',
            resolve: require_auth
          }).
          otherwise({
            redirectTo: 'trainers'
          });
      }]);

    
    mainApp.controller('navbarCtrl', ["$scope", "auth_service",
            function($scope, auth_service) {
                $scope.user = auth_service.get_fb_user();
            }]);
    
})();

