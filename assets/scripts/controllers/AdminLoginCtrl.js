'use strict';

angular.module('app')
    .controller('AdminLoginCtrl', [
        "$rootScope",
        "$scope",
        "$firebaseAuth",
        "$state",
        "$log",
        "AppF",
        "successAlertS",
        "errAlertS",
        function ($rootScope, $scope, $firebaseAuth, $state, $log, AppF, successAlert, errAlert) {
            $scope.auth = $firebaseAuth();
            $scope.admin = {};
            var root = firebase.database().ref('/');
            
            $scope.login = function() {
                AppF.loading = true;
                $log.debug('login', $scope.credentials);
                root.child('users').orderByChild('email').equalTo($scope.admin.email).once('value', function(snap){
                    var usersFromDB = snap.val();
                    if(usersFromDB){
                        for(var uid in usersFromDB){
                            var userFromDB = usersFromDB[uid];
                            if(userFromDB.active){
                                $scope.auth.$signInWithEmailAndPassword($scope.admin.email, $scope.admin.password).then(function(user) {
                                    AppF.user = user;
                                    successAlert("Bienvenid@");
                                    $state.go("admin.main");
                                }).catch(function(err){
                                    errAlert(err);
                                    AppF.loading = false;
                                });
                            } else {
                                errAlert('Usuario no activado');
                                AppF.loading = false;
                            }
                        }
                    } else {
                        errAlert('Usuario no existente');
                        AppF.loading = false;
                    }
                });
            };

            $rootScope.$on('loggedIn', function(event, logged) {
                if (logged) $state.go("admin.donations");
            });

            $rootScope.$watch("F.user", function(user){
                if(user){
                    $state.go("admin.donations");
                }
            })
        }
    ]);