'use strict';

angular.module('app')
    .controller('AdminRegisterCtrl', [
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
            var root = firebase.database().ref('/')
            
            $scope.register = function() {
                AppF.loading = true;
                $log.debug('register', $scope.credentials);
                $scope.auth.$createUserWithEmailAndPassword($scope.admin.email, $scope.admin.password).then(function(user) {
                    $scope.saveProfile(user.uid).then(function(){
                        successAlert('Se creo el usuario, en cuanto sea aprobado por administración, podras entrar.')
                        $state.go("admin.logout");
                    }, function(err){
                        errAlert(err);
                        AppF.loading = false;
                    });
                    
                }).catch(function(err){
                    errAlert(err);
                    AppF.loading = false;
                });
            };

            $scope.saveProfile = function(uid){
                console.log('saveProfile', user, $scope.admin);
                var user = $scope.admin;
                user.active = false;
                user.uid = uid;
                return root.child('users').child(uid).set(user);
            }
        }
    ]);