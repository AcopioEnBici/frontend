'use strict';

angular.module('app')
    .directive('searchObjectsBar', [
        function() {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    objects: "=",
                    search: "="
                },
                transclude: true,
                templateUrl: 'partials/search-objects-bar.html',
                link: function(scope, ele, attrs, ctrl) {
                    scope.allSelected = false;
                    scope.toggleSelectAll = function(array) {
                        for (var a in array) {
                            array[a].selected = !array[a].selected;
                        }
                        scope.allSelected = !scope.allSelected;
                    };
                }
            }
        }
    ]);