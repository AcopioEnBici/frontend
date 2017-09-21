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

            var init = function() {
                initiated = true;

                  //Victor:Para inicializar el mapa se tiene que poner el ID que se tiene en el template
                  NgMap.getMap("map").then(function(evtMap){
                    $scope.map = evtMap;
                  });

            }

            //Victor: funcion para obtener longitud y latitud
            $scope.getGrabPosition = function(){
              var position = $scope.map.markers[0].getPosition();
              return {
                "lat": position.lat(),
                "long":position.lng()
              }
            }

            $scope.save = function(){

              console.info('position', $scope.getGrabPosition());
              console.log('saving', $scope.donator);
                $scope.donator.createdAt = moment().valueOf();
                $scope.donator.status = 'esperando';
                root.child('donations').push($scope.donator).then(function(){
                    successAlertS('Gracias por registrarte como donador, en cuanto nos sea posible nos pondremos en contacto contigo');
                }, errAlertS);
            }

            $scope.ubicateMe = function(){
                console.log('ubicating me');
                //
            }

            init();
        }
    ]);
