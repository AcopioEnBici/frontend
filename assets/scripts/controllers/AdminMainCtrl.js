'use strict';

angular.module('app')
    .controller('AdminMainCtrl', [
        '$rootScope',
        '$scope',
        '$log',
        'AppF',
        function($rootScope, $scope, $log, F) {
            var initiated = false;

            var init = function() {
                initiated = true;
            }


            $rootScope.$on('loggedIn', function(event, logged) {
                $log.debug(logged, "loggedIn?")
                if (logged && !initiated) init();
            });

            if (F.user && !initiated) {
                init();
            }
        }
    ]);