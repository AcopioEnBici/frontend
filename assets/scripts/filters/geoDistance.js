'use strict';

Number.prototype.toRad = function() {
   return this * Math.PI / 180;
};

angular.module("app")
    .filter("geoDistance", [
        function() {
           /**
            * @param points Es el listado de coordenadas de los donadores
            * @param myLocations es la coordenada del voluntario
            * @param distance es la distancia en kilometros para el que va recoger
            */
            return function(points, myLocation, distance) {

               distance = parseInt(distance) || 10;

               function dist(meLocation, destination) {
                  var destinationLat = destination.latitude; 
                  var destinationLong = destination.longitude; 
                  var sourceLat = meLocation.latitude; 
                  var sourceLong = meLocation.longitude; 
                  var earthRadius = 6371; 
                  var latitudeDiff = destinationLat-sourceLat;
                  var dLat = latitudeDiff.toRad();  
                  var longitudeDiff = destinationLong-sourceLong;
                  var dLon = longitudeDiff.toRad();  
                  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(sourceLat.toRad()) * Math.cos(destinationLat.toRad()) * Math.sin(dLon/2) * Math.sin(dLon/2);  
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                  var d = earthRadius * c;
                  var m = d * 0.621371; 
                  var obj = {
                     kilometers: d,
                     miles: m 
                  };
                  return obj;
               }
               for(var t=0;t < points.length; t++){
                  points[t].distance = dist(myLocation, points[t]).kilometers;
               }
               return points.filter(function(item){
                  return item.distance < distance
               });
            }
        }
    ]);

    