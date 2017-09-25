'use strict';

angular.module('app')
    .directive('footPage', [
        function(){
            return {
                restrict: 'E',
                scope: true,
                transclude: true,
                templateUrl: 'partials/foot-page.html'
            }
        }
    ]);