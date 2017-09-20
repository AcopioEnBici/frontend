'use strict';

angular.module('app')
    .controller('AdminDonationsCtrl', [
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
            $scope.donations = [];

            var init = function() {
                initiated = true;
                $scope.donations = $firebaseArray(root.child('donators').orderByChild('pickedUp').equalTo(false));
                $log.debug('Donation Ctrl initiated');
            }

            $scope.save = function(donation){
                $log.debug('saving', donation);
                donation.updatedAt = moment().valueOf();
                donation.updatedBy = AppF.user.uid;
                $scope.donations.$save($scope.donation).then(function(){
                    successAlertS('Se guardó registro');
                }, errAlertS);
            }

            $scope.pickup = function(donation){
                $log.debug('picked up', donation);
                donation.pickedUp = true;
                $scope.save(donation);
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