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
        "$mdDialog",
        function($rootScope, $scope, errAlertS, successAlertS, $firebaseArray, F, $log, $mdDialog) {
            var initiated = false;
            var root = firebase.database().ref("/");
            $scope.donations = [];
            $scope.currentPage = 1;
            $scope.selected = [];

            var init = function() {
                initiated = true;
                // .orderByChild('pickedUp').equalTo(false) 
                $scope.donations = $firebaseArray(root.child('donators'));
                $log.debug('Donation Ctrl initiated');
            }

            $scope.save = function(donation){
                $log.debug('saving', donation);
                donation.updatedAt = moment().valueOf();
                donation.updatedBy = F.user.uid;
                $scope.donations.$save(donation).then(function(){
                    successAlertS('Se guardó registro');
                }, errAlertS);
            }

            $scope.pickup = function(donation){
                $log.debug('picked up', donation);
                donation.pickedUp = true;
                $scope.save(donation);
            }

            $scope.cancelPickup = function(donation){
                $log.debug('cancel picked up', donation);
                donation.pickedUp = false;
                $scope.save(donation);
            }

            $scope.remove = function(donation){
                $log.debug("removing: ", donation);
                return $scope.donations.$remove(donation);
            }

            $scope.showRemoveDialog = function(ev){
                $mdDialog.show(
                    $mdDialog.confirm({
                        onComplete: function afterShowAnimation() {
                            var $dialog = angular.element(document.querySelector('md-dialog'));
                            var $actionsSection = $dialog.find('md-dialog-actions');
                            var $cancelButton = $actionsSection.children()[0];
                            var $confirmButton = $actionsSection.children()[1];
                            angular.element($confirmButton).addClass('md-raised md-warn');
                            angular.element($cancelButton).addClass('md-raised');
                        }
                    })
                    .title('Remover ' + $scope.selected.length + ' donaciones?')
                    .textContent('No podrá recuperar los datos')
                    .ariaLabel('Lucky day')
                    .targetEvent(event)
                    .ok('Eliminar')
                    .cancel('Cancelar')
                ).then(function() {
                    var count = 0;
                    $log.debug("Deleting: ", $scope.selected);
                    angular.forEach($scope.selected, function(record) {
                        $scope.remove(record).then(function() {
                            if (count == $scope.selected.length) {
                                successAlert("Se borraron " + count + " donaciones");
                                $scope.selected = [];
                            }
                        });
                    });
                });
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