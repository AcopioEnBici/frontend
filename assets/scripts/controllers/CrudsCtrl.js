'use strict';

angular.module('app')
    .controller('CrudsCtrl', [
        "$rootScope",
        "$scope",
        "$firebaseArray",
        "$log",
        "$mdDialog",
        "$localStorage",
        "AppF",
        "errAlertS",
        "successAlertS",
        "slugifyFilter",
        function($rootScope, $scope, $firebaseArray, $log, $mdDialog, $localStorage, F, errAlert, successAlert, slugify) {
            var root = firebase.database().ref("/");
            var storageRef = firebase.storage().ref();
            var initiated = false;

            $scope.cruds = [];
            var init = function() {
                $scope.loadAll();

                $scope.newItem = false;
                $scope.uploadImage = false;
                initiated = true;
            }

            $scope.loadAll = function() {
                var crudsQ = root.child('cruds');
                $scope.cruds = $firebaseArray(crudsQ);
                $scope.cruds.$loaded(function(cruds) {
                    $scope.cruds = cruds;
                    $log.debug('Loaded', $scope.cruds);
                });
            }


            $scope.add = function(crud) {
                $log.debug("creating: ", crud);
                crud.created_on = firebase.database.ServerValue.TIMESTAMP;
                crud.images = {
                    portada: false,
                    logo: false
                };
                $scope.cruds.$add(crud).then(function() {
                    F.counter.cruds = F.counter.cruds + 1;
                    F.counter.$save();
                    successAlert("Crud Creada");
                    $scope.newItem = false;
                    $mdDialog.cancel();
                }, errAlert);
            }

            $scope.save = function(crud) {
                $log.debug("saving: ", crud);
                crud.updated_on = firebase.database.ServerValue.TIMESTAMP;
                $scope.cruds.$save(crud).then(function() {
                    successAlert("Crud Guardado");
                }, errAlert);
            }

            $scope.remove = function(crud) {
                $log.debug("removing: ", crud);
                return $scope.cruds.$remove(crud);
            }

            $scope.upload = function(files, whatImage, crud) {
                var file = files[0].lfFile;
                var imagesRef = storageRef.child('cruds/');
                // whatImage = [logo,portada]
                var fileName = slugify(crud.name) + '_' + whatImage + '_' + '.jpg';
                var spaceRef = imagesRef.child(fileName);
                var path = spaceRef.fullPath;

                var uploadTask = spaceRef.put(file);
                $scope.progress = 0;
                uploadTask.on('state_changed', function(snapshot) {
                    $scope.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    $log.info('Upload is ' + $scope.progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            $log.debug('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            $log.debug('Upload is running');
                            break;
                    }
                }, errAlert, function() {
                    crud.images[whatImage] = uploadTask.snapshot.downloadURL;
                    $scope.cruds
                        .$save(crud)
                        .then(function() {
                            successAlert("Se subió el archivo correctamente");
                        }, errAlert);
                });

                $log.debug("uploading: ", crud, whatImage, file);
            }

            $scope.removeUpload = function(crud, whatImage) {
                var fileName = slugify(crud.name) + '_' + whatImage + '_' + '.jpg';
                // Create a reference to the file to delete
                var desertRef = storageRef.child('cruds/' + fileName);
                // Delete the file
                desertRef.delete().then(function() {
                    crud.images[whatImage] = false;
                    $scope.cruds
                        .$save(crud)
                        .then(function() {
                            successAlert("Se borró el archivo correctamente");
                        }, errAlert);
                }).catch(function(err){
                    // if here delete ref anyway
                    crud.images[whatImage] = false;
                    $scope.cruds
                        .$save(crud)
                        .then(function() {
                            successAlert("Se borró el archivo correctamente");
                        }, errAlert);
                });
            }

            $scope.cancelUpload = function(uploadTask) {
                uploadTask.cancel();
            }

            $scope.showAddDialog = function(event) {
                $scope.newItem = true;
                $scope.crud = {};
                $mdDialog.show({
                    scope: $scope,
                    preserveScope: true,
                    controller: "DialogCtrl",
                    templateUrl: 'partials/admin/dialogs/cruds.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true
                });
            };

            $scope.showSaveDialog = function(event, crud) {
                $scope.crud = crud;
                $mdDialog.show({
                    scope: $scope,
                    preserveScope: true,
                    controller: "DialogCtrl",
                    templateUrl: 'partials/admin/dialogs/cruds.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true
                });
            };

            $scope.showRemoveDialog = function(event) {
                $scope.crudsToBeRemoved = F.getSelected($scope.cruds);
                var msg = (F.safeRemove) ? 'Podrá recuperar sus datos en la papelera hasta por ' + F.recycleDays + ' días.' : 'No podrá recuperar sus datos.';

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
                    .title('Remover ' + $scope.crudsToBeRemoved.length + ' cruds?')
                    .textContent(msg)
                    .ariaLabel('Lucky day')
                    .targetEvent(event)
                    .ok('Eliminar')
                    .cancel('Cancelar')
                ).then(function() {
                    var count = 0;
                    $log.debug("Deleting: ", $scope.crudsToBeRemoved);
                    angular.forEach($scope.crudsToBeRemoved, function(crud) {
                        if (F.safeRemove) {
                            // todo
                            // $scope.removeSafely(drustore).then(function(){
                            //     $scope.count++
                            //     if($scope.count == $scope.crudsToBeRemoved.length){
                            //         // todo with undo
                            //         // actionAlert("Se mandaron " + $scope.count + " cruds a la papelera", );
                            //     }
                            // });
                        } else {
                            $scope.remove(crud).then(function() {
                                F.counter.cruds = F.counter.cruds - 1;
                                F.counter.$save();
                                count++
                                if (count == $scope.crudsToBeRemoved.length) {
                                    successAlert("Se borraron " + count + " cruds");
                                }
                            });
                        }
                    });
                });
            };

            $rootScope.$on('loggedIn', function(event, logged) {
                $log.debug(logged, "loggedIn?")
                if (logged) {
                    init();
                }
            });

            if (F.user && !initiated) {
                init();
            }
        }
    ]);