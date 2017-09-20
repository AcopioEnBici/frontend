'use strict';

angular.module('app')
    .directive('titleObjectsBar', [
        function() {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    objects: "=",
                    title: "="
                },
                transclude: true,
                templateUrl: 'partials/title-objects-bar.html'
            }
        }
    ]);