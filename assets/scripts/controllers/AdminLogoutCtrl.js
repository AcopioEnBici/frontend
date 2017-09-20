'use strict';

angular.module("app")
    .controller("AdminLogoutCtrl", [
        "$scope",
        "$firebaseAuth",
        "$log",
        "errAlertS",
        "AppF",
        "$localStorage",
        "$state",
        function($scope, $firebaseAuth, $log, errAlert, F, $localStorage, $state){
            var logout = function(){
                $log.debug("Bye");
                firebase.auth().signOut().then(function () {
                    // Sign-out successful.
                    firebase.database().goOffline();
                    F.user = false;
                    $localStorage.lastPage = null;
                    $state.go('home');
                }, errAlert);
            }
            logout();
        }
    ])