'use strict';

angular.module('app')
    .controller('GeneralCtrl', [
        "$rootScope",
        "$scope",
        "$http",
        "$sessionStorage",
        "AppF",
        "$state",
        "volunteerStates",
        function($rootScope, $scope, $http, $sessionStorage, AppF, $state, volunteerStates) {
            $rootScope.F = AppF;
            $rootScope.state = $state;
            $rootScope.volunteerStates = volunteerStates;
        }
    ]);