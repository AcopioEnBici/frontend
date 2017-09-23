'use strict';

angular.module('app')
    .controller('AdminCentersCtrl', [
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
            $scope.centers = [];
            $scope.currentPage = 1;
            $scope.selected = [];

            var init = function() {
                initiated = true;
                $scope.centers = $firebaseArray(root.child('centers'));
                $log.debug('Donation Ctrl initiated');
            }

            $scope.save = function(center){
                $log.debug('saving', center);
                center.updatedAt = moment().valueOf();
                center.updatedBy = F.user.uid;
                $scope.centers.$save(center).then(function(){
                    successAlertS('Se guardó registro');
                }, errAlertS);
            }

            $scope.activate = function(center){
                $log.debug('activate', center);
                center.active = true;
                $scope.save(center);
            }

            $scope.deactivate = function(center){
                $log.debug('deactivate', center);
                center.active = false;
                $scope.save(center);
            }

            $scope.remove = function(center){
                $log.debug("removing: ", center);
                return $scope.centers.$remove(center);
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
                    .title('Remover ' + $scope.selected.length + ' centros de acopio?')
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
                                successAlert("Se borraron " + count + " centros de acopio");
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