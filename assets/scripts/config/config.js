'use strict';

angular.module("app")
    .config([
        "$mdThemingProvider",
        "$logProvider",
        "$locationProvider",
        function($mdThemingProvider, $logProvider, $locationProvider){
            $logProvider.debugEnabled(true);
            $locationProvider.html5Mode(false);
            
            $mdThemingProvider.theme('red')
                .primaryPalette('red')
                .accentPalette('orange');

            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('indigo'); 
    }])