/*
Victor Espinosa:im.vicoy@gmail.com
twitter:@vicoysito
*/


'use strict';

angular.module('app')
    .controller('DonateCtrl', [
        "$rootScope",
        "$scope",
        "errAlertS",
        "successAlertS",
        "NgMap",
        function($rootScope, $scope, errAlertS, successAlertS, NgMap) {
            var initiated = false;
            $scope.map;
            var root = firebase.database().ref("/");
            $scope.donator = {};
            $scope.donationSent = false;

            var init = function() {
                initiated = true;
            }

            var thanks = function(){
                $scope.donationSent = true;
                $scope.$apply();
            }

            //Victor:Para inicializar el mapa se tiene que poner el ID que se tiene en el template
            NgMap.getMap("map").then(function(evtMap){
              $scope.map = evtMap;
            });

            //Victor: funcion para obtener longitud y latitud
            $scope.getGrabPosition = function(){
              var position = $scope.map.markers[0].getPosition();
              return {
                "lat": position.lat(),
                "lng": position.lng()
              }
            }

            $scope.save = function(){
                var position = $scope.getGrabPosition();
                $scope.donator.createdAt = moment().valueOf();
                $scope.donator.latitude = position.lat;
                $scope.donator.longitude = position.lng;
                $scope.donator.status = 'esperando';
                console.log('saving', $scope.donator);
                root.child('donations').push($scope.donator).then(function(){
                    thanks();
                }, errAlertS);
            }

            $scope.ubicateMe = function(){
                console.log('ubicating me');
            }

            $scope.getCoords = function() {
              //TODO: Revisar esta variable para que lo aplique con el modelo de addressInput
              var value24 = document.getElementById("addressInput").value;
              NgMap.getGeoLocation(value24).then(function(latlng) {
                $scope.map.markers[0].setPosition(latlng);
                $scope.map.setCenter(latlng);
              });
            };

            init();
        }
    ]);
