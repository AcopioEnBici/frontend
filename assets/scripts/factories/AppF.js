'use strict';

angular.module('app')
    .factory('AppF', [
        "$state",
        function($state) {
            var obj = {
                paginate: 5,
                recycleDays: 30,
                inModule: 'site',
                user: false,
                contactFormUrl: "/contacto.php",
                goto: function(state) {
                    $state.go(state);
                },
                getSelected: function(array) {
                    var selected = [];
                    for (var a in array) {
                        if (array[a].selected) selected.push(array[a]);
                    }
                    return selected;
                },
                somethingIsSelected: function(objects) {
                    for (var a in objects) {
                        if (objects[a].selected) return true;
                    }
                    return false;
                }
            };

            return obj;
        }
    ]);