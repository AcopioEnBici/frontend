'use strict';

angular.module('app')
    .controller('AdminDeliversCtrl', [
        "$rootScope",
        "$scope",
        "errAlertS",
        "successAlertS",
        "$firebaseArray",
        "AppF",
        "$log",
        function($rootScope, $scope, errAlertS, successAlertS, $firebaseArray, F, $log) {
            var initiated = false;
            var root = firebase.database().ref("/");
            $scope.delivers = [];

            var init = function() {
                initiated = true;
                $scope.delivers = $firebaseArray(root.child('delivers'));
                $log.debug('Donation Ctrl initiated');
            }

            $scope.save = function(deliver){
                $log.debug('saving', deliver);
                deliver.updatedAt = moment().valueOf();
                deliver.updatedBy = AppF.user.uid;
                $scope.delivers.$save($scope.deliver).then(function(){
                    successAlertS('Se guardó registro');
                }, errAlertS);
            }

            $scope.activate = function(deliver){
                $log.debug('activate', deliver);
                deliver.active = true;
                $scope.save(deliver);
            }

            $rootScope.$on('loggedIn', function(event, logged) {
                $log.debug(logged, "loggedIn?")
                if (logged && !initiated) init();
            });

            if (F.user && !initiated) {
                init();
            }
        }
    ]);