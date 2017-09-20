'use strict';

angular.module('app')
    .controller('AdminCtrl', [
        "$rootScope",
        "$scope",
        "$firebaseObject",
        "$firebaseArray",
        "$state",
        "$log",
        "AppF",
        function($rootScope, $scope, $firebaseObject, $firebaseArray, $state, $log, F) {
            var initiated = false;
            var init = function() {
                var root = firebase.database().ref("/");
                $log.debug("AdminCtrl Loaded");
                F.inModule = 'admin';
            }

            $rootScope.$on('loggedIn', function(event, logged) {
                $log.debug(logged, "loggedIn?")
                if (logged) init();
            });

            if (F.user && !initiated) {
                init();
            }
        }
    ]);