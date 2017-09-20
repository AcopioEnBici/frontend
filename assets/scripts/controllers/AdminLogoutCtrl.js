'use strict';

angular.module("app")
    .controller("AdminLogoutCtrl", [
        "$scope",
        "$firebaseAuth",
        "$log",
        "errAlertS",
        "AppF",
        "$localStorage",
        function($scope, $firebaseAuth, $log, errAlert, F, $localStorage){
            var logout = function(){
                $log.debug("Bye");
                firebase.auth().signOut().then(function () {
                    // Sign-out successful.
                    firebase.database().goOffline();
                    F.user = false;
                    $localStorage.lastPage = null;
                }, errAlert);
            }
            logout();
        }
    ])