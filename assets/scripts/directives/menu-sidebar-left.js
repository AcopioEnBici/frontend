'use strict';

angular.module('app')
    .directive('menuSidebarLeft', [
        function(){
            return {
                restrict: 'E',
                scope: true,
                transclude: true,
                templateUrl: 'partials/menu-sidebar-left.html'
            }
        }
    ]);

