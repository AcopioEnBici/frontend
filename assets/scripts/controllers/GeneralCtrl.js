'use strict';

angular.module('app')
    .controller('GeneralCtrl', [
        "$rootScope",
        "$scope",
        "$http",
        "$sessionStorage",
        "AppF",
        function($rootScope, $scope, $http, $sessionStorage, AppF) {
            $rootScope.F = AppF;

            var init = function() {
                
            }

            init();
        }
    ]);