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
            $scope.users = [];
            $scope.currentPage = 1;
            $scope.selected = [];

            var init = function() {
                initiated = true;
                $scope.users = $firebaseArray(root.child('users').orderByChild("type").equalTo("staff"));
                $log.debug('Donation Ctrl initiated');
            }

            $scope.save = function(user){
                $log.debug('saving', user);
                user.updatedAt = moment().valueOf();
                user.updatedBy = F.user.uid;
                $scope.users.$save(user).then(function(){
                    successAlertS('Se guardó registro');
                }, errAlertS);
            }

            $scope.activate = function(user){
                $log.debug('activate', user);
                user.active = true;
                $scope.save(user);
            }

            $scope.deactivate = function(user){
                $log.debug('deactivate', user);
                user.active = false;
                $scope.save(user);
            }

            $scope.remove = function(user){
                $log.debug("removing: ", user);
                return $scope.users.$remove(user);
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
