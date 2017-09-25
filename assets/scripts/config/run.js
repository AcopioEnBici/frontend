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
        "staffStates",
        "adminStates",
        "loginRedirectPath",
        "AppF",
        "$firebaseObject",
        function($rootScope, $state, $log, $location, $localStorage, $timeout, config, states, staffStates, adminStates, loginRedirectPath, F, $firebaseObject) {
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
                    checkStaff(toState.name, e);
                    checkAdmin(toState.name, e);
                }
            });

            var checkStaff = function(route, e){
                if(isStaff(route)){
                    console.log(F.auth, "AUTH Staff")
                    if(F.user.providerData[0].providerId == 'twitter.com'){
                        $state.go('home');
                        $log.error('No tienes permiso para entrar a esta ruta')
                        e.preventDefault();
                    }
                }
            }

            var checkAdmin = function(route, e){
                if(isAdmin(route)){
                    console.log(F.auth, "AUTH Admin")
                    if(F.user.providerData[0].providerId == 'twitter.com'){
                        $state.go('home');
                        $log.error('No tienes permiso para entrar a esta ruta')
                        e.preventDefault();
                    }
                }
                if(F.staffProfile.type == 'staff'){
                    $state.go('admin.donations');
                    $log.error('No tienes permiso para entrar a esta ruta')
                    e.preventDefault();
                }
            }

            $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
                // We can catch the error thrown when the $requireSignIn promise is rejected
                console.log("error de ruta", error);
                // and redirect the user back to the home page
                if (error === "AUTH_REQUIRED") {
                    $state.go("home");
                } else {
                    $state.go("404");
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
                        } else {
                            firebase.database().ref('/users').child(user.uid).once('value', function(snap){
                                var profileS = snap.val();
                                if(profileS) F.staffProfile = profileS;
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

            function isStaff(route){
                var isStaff = (staffStates.indexOf(route) !== -1);
                if(!route){
                    isPermitted = true;
                }
                return isStaff;
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