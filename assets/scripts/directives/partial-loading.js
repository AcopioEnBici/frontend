'use strict';

angular.module('app')
    .directive('partialLoading', [
        function(){
            return {
                restrict: 'A',
                scope: true,
                transclude: true,
                templateUrl: 'partials/partial-loading.html'
            }
        }
    ]);