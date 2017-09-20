'use strict';

angular.module('app')
    .controller('DeliverCtrl', [
        "$rootScope",
        "$scope",
        "$log",
        "successAlertS",
        "errAlertS",
        function($rootScope, $scope, $log, successAlertS, errAlertS) {
            var initiated = false;
            $scope.deliver = {};
            var root = firebase.database().ref('/');

            var init = function() {
                initiated = true;
                $log.debug('Deliver Ctrl initiated');
            }

            $scope.save = function(){
                $log.debug('saving', $scope.deliver);
                $scope.deliver.createdAt = moment().valueOf();
                $scope.deliver.active = false;
                root.child('delivers').push($scope.deliver).then(function(){
                    successAlertS('Gracias por registrarte, en cuanto nos sea posible nos pondremos en contacto contigo');
                }, errAlertS);
            }

            init();
        }
    ]);