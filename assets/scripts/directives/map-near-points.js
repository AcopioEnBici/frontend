'use strict';

angular.module('app')
    .directive('mapNearPoints', [
        "geoDistanceFilter",
        "NgMap",
        function(geoDistanceFilter, NgMap){
            return {
                restrict: 'E',
                scope: {
                    points: '=',
                    distance: '=',
                    onPointSelect: '&'
                },
                templateUrl: 'partials/map-near-points.html',
                link: function(scope, ele, attrs){
                    // scope.currentP = {
                    //     latitude: 19.390519, longitude: -99.4238064
                    // }
                    scope.currentP = {
                        latitude: 32.123, 
                        longitude: 43.21
                    }
                    scope.pointSelected = false;
                    scope.nearesPoints = [];

                    var getNearestPoints = function(){
                        NgMap.getMap().then(function(map){
                            var center = map.getCenter();
                            google.maps.event.trigger(map, "resize");
                            map.setCenter(center);
                            scope.nearestPoints = geoDistanceFilter(scope.points, scope.currentP, scope.distance);
                            console.log(scope.nearesPoints, scope.points, scope.currentP, "WTF");
                        }).catch(function(err){
                            console.error(err);
                        });
                    }

                    document.ready(function(){
                        var getNearestWatcher = scope.$watchGroup(['points','distance'], function(all){
                            if(all[0] && all[1]){
                                if(scope.points.length) {
                                    getNearestPoints();
                                    getNearestWatcher();
                                }
                            }
                        },1);
                    });
                }
            }
        }
    ]);