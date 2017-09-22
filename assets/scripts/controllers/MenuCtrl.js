'use strict';

angular.module('app')
    .controller('MenuCtrl', [
        '$scope',
        '$log',
        '$mdSidenav',
        '$timeout',
        '$rootScope',
        'AppF',
        '$window',
        function ($scope, $log, $mdSidenav, $timeout, $rootScope, AppF, $window) {
            $log.debug('inside MenuCtrl');
            // $scope.toggleLeft = buildDelayedToggler('left');
            $scope.toggleLeft = function () {
                $mdSidenav('left')
                    .toggle()
                    .then(function () {
                        $log.debug("toggle is done");
                    });
            }
            $rootScope.F = AppF;

            $scope.close = function () {
                $mdSidenav('left')
                .close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
            }

            $scope.triggerMenu = function(ev){
                angular.element('.nav-trigger').toggleClass('active');
                angular.element('.nav').toggleClass('mobile-nav-active');
            }

            $window.onload = function(event){
                toogleMenu()
            }

            $window.onresize = function(event){
                toogleMenu()
            }

            var toogleMenu = function(){
                var width = $window.innerWidth;
                if (width >= 769) {
                    console.log("big device");
                    angular.element('.nav').removeClass('mobile-nav-active');
                } else {
                    console.log("small device")
                }
            }

            /**
             * Supplies a function that will continue to operate until the
             * time is up.
             */
            function debounce(func, wait, context) {
                var timer;
                return function debounced() {
                    var context = $scope,
                        args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        timer = undefined;
                        func.apply(context, args);
                    }, wait || 10);
                };
            }
            /**
             * Build handler to open/close a SideNav; when animation finishes
             * report completion in console
             */
            function buildDelayedToggler(navID) {
                return debounce(function () {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
                }, 200);
            }
        }
    ]);