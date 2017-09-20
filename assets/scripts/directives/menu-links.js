'use strict';

angular.module('app')
    .directive('menuLinks', [
        "$state",
        function($state){
            return {
                restrict: 'A',
                templateUrl: 'partials/menu-links.html',
                link: function(scope, ele, attrs, ctrl){
                    scope.isOpen = function(state){
                        return $state.includes(state);
                    }
                }
            }
        }
    ]);