'use strict';

angular.module("app")
    .run([
        "$rootScope",
        "$state",
        "$log",
        "$location",
        "$localStorage",
        "$timeout",
        "FB_CONFIG",
        "allowedOfflineStates",
        "loginRedirectPath",
        "AppF",
        "$firebaseObject",
        function($rootScope, $state, $log, $location, $localStorage, $timeout, config, states, loginRedirectPath, F, $firebaseObject) {
            firebase.initializeApp(config);

            var auth = firebase.auth();
            // watch for login status changes and redirect if appropriate
            auth.onAuthStateChanged(check);

            $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
                if (!F.user) {
                    if (!isPermitted(toState.name)) {
                        $log.debug(F.user, loginRedirectPath, $state.current.name, "YES");
                        $localStorage.lastPage = toState.name;
                        $state.go(loginRedirectPath);
                        e.preventDefault();
                    }
                } 
            });
            var c = 1;
            function check(user) {
                c++
                $log.debug(user, c);
                F.user = user;
                if (angular.isObject(user)) {
                    // $rootScope.F = F;
                    if(F.user.providerData){
                        if(F.user.providerData[0].providerId == 'twitter.com'){
                            firebase.database().ref('/volunteers').child(user.uid).once('value', function(snap){
                                var profile = snap.val();
                                if(profile) F.userProfile = profile;
                            });
                        }
                    }
                    // User signed in!
                    $rootScope.$broadcast('loggedIn', true);
                } else {
                    if (!isPermitted($state.current.name)) {
                        $state.go(loginRedirectPath);
                    }
                    $log.debug(user, loginRedirectPath, $state.current, "User Not Logged");
                }
            }

            function isPermitted(route) {
                var isPermitted = (states.indexOf(route) !== -1);
                if (!route) {
                    isPermitted = true;
                }
                return isPermitted;
            }
        }
    ]);