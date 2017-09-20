'use strict';

angular.module('app')
    .controller('DeliverCtrl', [
        "$rootScope",
        "$scope",
        function($rootScope, $scope) {
            var initiated = false;

            var init = function() {
                initiated = true;
                console.log('Deliver Ctrl initiated');
            }

            init();
        }
    ]);