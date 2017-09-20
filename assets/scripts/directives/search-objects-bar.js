'use strict';

angular.module('app')
    .directive('searchObjectsBar', [
        function() {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    search: "="
                },
                transclude: true,
                templateUrl: 'partials/search-objects-bar.html'
            }
        }
    ]);