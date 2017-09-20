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

            var getVersion = function(project) {
                return $http.get("http://v.tu-desarrollo.com/" + project + "?auth=dgslkdjfglskakl423lk45235flsdmf3l4kmt234");
            }

            var init = function() {
                if ($sessionStorage.version && $sessionStorage.version !== "N/A") {
                    AppF.version = $sessionStorage.version;
                } else {
                    getVersion('mdf')
                        .then(function(res) {
                            var data = res.data;
                            AppF.version = data.version;
                            $sessionStorage.version = AppF.version;
                        });
                }
            }

            init();
        }
    ]);