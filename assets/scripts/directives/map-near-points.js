'use strict';

angular.module('app')
    .directive('mapNearPoints', [
        "geoDistanceFilter",
        "NgMap",
        "$document",
        function(geoDistanceFilter, NgMap, $document){
            return {
                restrict: 'E',
                scope: {
                    points: '=',
                    distance: '=',
                    onPointSelect: '='
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

                    scope.selectPoint = function(point){
                        if(point != scope.onPointSelect) scope.onPointSelect = point;
                        else scope.onPointSelect = false;
                    }

                    var getNearestPoints = function(){
                        scope.nearestPoints = geoDistanceFilter(scope.points, scope.currentP, scope.distance);
                        setTimeout(function(){
                            NgMap.getMap().then(function(map){
                                var center = map.getCenter();
                                google.maps.event.trigger(map, "resize");
                                // map.setCenter(center);
                                // console.log(scope.nearesPoints, scope.points, scope.currentP);
                            }).catch(function(err){
                                console.error(err);
                            });
                        }, 1000)
                    }

                    $document.ready(function(){
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