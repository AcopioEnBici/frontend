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
        "adminStates",
        "loginRedirectPath",
        "AppF",
        "$firebaseObject",
        function($rootScope, $state, $log, $location, $localStorage, $timeout, config, states, adminStates, loginRedirectPath, F, $firebaseObject) {
            firebase.initializeApp(config);

            F.auth = firebase.auth();
            // watch for login status changes and redirect if appropriate
            F.auth.onAuthStateChanged(check);

            $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
                if (!F.user) {
                    if (!isPermitted(toState.name)) {
                        $log.debug(F.user, loginRedirectPath, $state.current.name, "YES");
                        $localStorage.lastPage = toState.name;
                        $state.go(loginRedirectPath);
                        e.preventDefault();
                    } 
                } else {
                    checkAdmin(toState.name, e);
                }
            });

            var checkAdmin = function(route, e){
                if(isAdmin(route)){
                    console.log(F.auth, "AUTH")
                    if(F.user.providerData[0].providerId == 'twitter.com'){
                        $state.go('home');
                        $log.error('No tienes permiso para entrar a esta ruta')
                        e.preventDefault();
                    }
                }
            }

            $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
                // We can catch the error thrown when the $requireSignIn promise is rejected
            
                // and redirect the user back to the home page
                if (error === "AUTH_REQUIRED") {
                  $state.go("home");
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

            function isAdmin(route){
                var isAdmin = (adminStates.indexOf(route) !== -1);
                if(!route){
                    isPermitted = true;
                }
                return isAdmin;
            }
        }
    ]);