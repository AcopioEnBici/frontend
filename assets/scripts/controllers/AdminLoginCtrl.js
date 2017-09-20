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
            
            $scope.login = function() {
                AppF.loading = true;
                $log.debug('login', $scope.credentials);
                $scope.auth.$signInWithEmailAndPassword($scope.admin.email, $scope.admin.password).then(function(user) {
                    AppF.user = user;
//                    if(user.emailVerified){
//                        successAlert(user.email, 'Bienvenid@');
//                        $state.go(initialState);
//                    } else {
//                        $state.go("verify-account");
//                    }
                    successAlert("Bienvenid@");
                    $state.go("admin.main");
                }).catch(function(err){
                    errAlert(err);
                    AppF.loading = false;
                });
            };

            $rootScope.$on('loggedIn', function(event, logged) {
                if (logged) $state.go("admin.main");
            });

            $rootScope.$watch("F.user", function(user){
                if(user){
                    $state.go("admin.main");
                }
            })
        }
    ]);