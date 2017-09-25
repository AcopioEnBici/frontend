'use strict';

angular.module('app')
    .controller('AdminStaffCtrl', [
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
            $scope.staff = [];
            $scope.currentPage = 1;
            $scope.selected = [];

            var init = function() {
                initiated = true;
                $scope.staff = $firebaseArray(root.child('users').orderByChild("type").equalTo("staff"));
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

            $scope.remove = function(volunteer){
                $log.debug("removing: ", volunteer);
                return $scope.volunteers.$remove(volunteer);
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
                    .title('Remover ' + $scope.selected.length + ' voluntarios?')
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
                                successAlert("Se borraron " + count + " voluntarios");
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
