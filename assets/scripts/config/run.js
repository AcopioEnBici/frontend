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
        function($rootScope, $state, $log, $location, $localStorage, $timeout, config, states, loginRedirectPath, F) {
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
                $log.debug(user, c)
                if (angular.isObject(user)) {
                    F.user = angular.copy(user);
                    // User signed in!
                    $rootScope.$emit('loggedIn', true);
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