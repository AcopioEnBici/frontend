'use strict';

angular.module('app')
    .controller('DonateCtrl', [
        "$rootScope",
        "$scope",
        "errAlertS",
        "successAlertS",
        function($rootScope, $scope, errAlertS, successAlertS) {
            var initiated = false;
            var root = firebase.database().ref("/");
            $scope.donator = {};

            var init = function() {
                initiated = true;
                console.log('Donate Ctrl initiated');
            }

            $scope.save = function(){
                console.log('saving', $scope.donator);
                $scope.donator.createdAt = moment().valueOf();
                $scope.donator.pickedUp = false;
                root.child('donators').push($scope.donator).then(function(){
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