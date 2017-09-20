'use strict';

angular.module("app")
    .controller("DialogCtrl", [
        "$scope", 
        "$mdDialog",
        function ($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
        }
    ])