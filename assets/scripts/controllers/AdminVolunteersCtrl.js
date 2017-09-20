'use strict';

angular.module('app')
    .controller('AdminVolunteersCtrl', [
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
            $scope.volunteers = [];

            var init = function() {
                initiated = true;
                $scope.volunteers = $firebaseArray(root.child('volunteers'));
                $log.debug('Donation Ctrl initiated');
            }

            $scope.save = function(volunteer){
                $log.debug('saving', volunteer);
                volunteer.updatedAt = moment().valueOf();
                volunteer.updatedBy = F.user.uid;
                $scope.volunteers.$save(volunteer).then(function(){
                    successAlertS('Se guardó registro');
                }, errAlertS);
            }

            $scope.activate = function(volunteer){
                $log.debug('activate', volunteer);
                volunteer.active = true;
                $scope.save(volunteer);
            }

            $scope.deactivate = function(volunteer){
                $log.debug('deactivate', volunteer);
                volunteer.active = false;
                $scope.save(volunteer);
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