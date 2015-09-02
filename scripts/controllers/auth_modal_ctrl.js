(function () {
    'use strict';
  
    angular.module('mainApp').controller('AuthModalCtrl', ['$scope', '$modalInstance', 'auth_service',
        function($scope, $modalInstance, auth_service) {
            
            $scope.ok = function () {
                $modalInstance.close(0);
            };
            
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }; 
            
            $scope.login = function(oauth_provider) {
                auth_service.login(oauth_provider);
                $scope.ok();
            };            
    }]);

})();
