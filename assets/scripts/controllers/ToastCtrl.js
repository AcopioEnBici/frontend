'use strict';

angular.module("app")
    .controller("ToastCtrl", [
        "$scope",
        "$mdToast",
        function($scope, $mdToast){
            $scope.closeToast = function() {
                $mdToast.hide();
            };
        }
    ])