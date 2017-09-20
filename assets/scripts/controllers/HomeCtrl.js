'use strict';

angular.module('app')
    .controller('HomeCtrl', [
        "$rootScope",
        "$scope",
        function($rootScope, $scope) {
            var initiated = false;

            var init = function() {
                initiated = true;
                console.log('Home Ctrl initiated')
            }

            init();
        }
    ]);