'use strict';

angular.module('app')
    .filter('randomKeyOfArray', [
        function(){
            return function(array){
                return Math.floor((Math.random() * array.length) + 1) - 1
            }
        }
    ])