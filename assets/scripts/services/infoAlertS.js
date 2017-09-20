'use strict';

angular.module("app")
    .service("infoAlertS", [
    "$mdToast",
    "$log",
    function ($mdToast, $log) {
        return function (msg) {
            $log.info(msg);

            var toast = {
                    position: "bottom right",
                    hideDelay: 5000,
                    template: '<md-toast><span flex>' + msg + '</span><md-button class="md-icon-button" ng-click="closeToast()"><md-icon style="color: white" aria-label="hey" class="material-icons step">clear</md-icon></md-button></md-toast>',
                    controller: "ToastCtrl"
                };

                // show previously created toast
                $mdToast.show(toast);
        }
    }
])