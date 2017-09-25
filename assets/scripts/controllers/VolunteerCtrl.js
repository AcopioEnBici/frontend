'use strict';

angular.module('app')
    .controller('VolunteerCtrl', [
        "$rootScope",
        "$scope",
        "$log",
        "successAlertS",
        "errAlertS",
        "$firebaseAuth",
        "$state",
        "$q",
        "AppF",
        "$firebaseArray",
        "$document",
        "geoDistanceFilter",
        function($rootScope, $scope, $log, successAlertS, errAlertS, $firebaseAuth, $state, $q, F, $firebaseArray, $document, geoDistanceFilter) {
            var initiated = false;
            $scope.volunteer = {};
            var root = firebase.database().ref('/');
            $scope.auth = $firebaseAuth();

            var init = function(user){
                if(user){
                    if(user.providerData){
                        if(user.providerData[0]){
                            if(user.providerData[0].providerId == 'twitter.com'){
                                console.log(user, "loggedIn User")
                                // checar si usuario existe
                                checkIfUserExist(user.uid).then(function(volunteer){
                                    if(volunteer){
                                        console.log(volunteer, 'volunteer existe');
                                        $scope.volunteer = volunteer;
                                        if($scope.volunteer.hasOwnProperty('selectedDonation')){
                                            // esto va a redirigir al usuario al paso correcto
                                            getSelectedDonation($scope.volunteer.selectedDonation);
                                        } else {
                                            $state.go('chooseDonation');
                                        }
                                    } else {
                                        $scope.volunteer = {
                                            registeredTovolunteer: false,
                                            provider: 'twitter',
                                            uid: user.uid,
                                            active: false
                                        };
                                        console.log($scope.volunteer, 'volunteer no existe');
                                        console.log('se está en el paso correcto');
                                    }
                                    initiated = true;
                                });
                                
                            }
                        }
                    }
                }
            }

            /**
             * Guarda los cambios que tenga selectedDonation y crea una alera con un mensaje de exito
             * @param {*} donation 
             * @param string successMsg 
             */
            var saveDonation = function(donation, successMsg){
                donation.updatedAt = moment().valueOf();
                var id = angular.copy(donation.$id);
                delete donation.$id;
                delete donation.$priority;
                delete donation.distance; // se le agrega distance por el filtro de geoLocation
                console.log(donation,id, 'saving donation');
                root.child('donations').child(id).set(donation).then(function(){
                    donation.$id = id;
                    successAlertS(successMsg);
                }, errAlertS);
            }

            /**
             * Guarda una propiedad y valor especificos del voluntario logeado
             * @param {*} value 
             * @param string prop 
             */
            var saveVolunteer = function(value, prop){
                console.log(value, prop, 'saving volunteer');
                return root.child('volunteers').child(F.user.uid).child(prop).set(value);
            }

            /**
             * Se checa si el user logeado es un voluntario o aun no ha sido creado
             * @param string uid 
             */
            var checkIfUserExist = function(uid){
                var promise = $q.defer();
                root.child('volunteers').child(uid).once('value', function(snap){
                    var volunteer = snap.val();
                    if(volunteer){
                        promise.resolve(volunteer);
                    } else {
                        promise.resolve(false);
                    }
                }, function(err){
                    errAlertS(err);
                    promise.reject(err);
                });
                return promise.promise;
            }

            /**
             * Trae a $scope.selectedDonation la donacion, versión modificada para redireccionar segun status de donación
             * @param string donationId 
             */
            var getSelectedDonation = function(donationId){
                console.log("getSelectedDonation", donationId);
                root.child('donations').child(donationId).once('value', function(snap){
                    $scope.selectedDonation = snap.val();
                    $scope.selectedDonation.$id = snap.key;
                    $scope.$apply();
                    if($scope.selectedDonation.status == 'esperando' || $scope.selectedDonation.status == 'recogiendo'){
                        $state.go('chooseDonation');
                    } else  if($scope.selectedDonation.status == 'recogido' || $scope.selectedDonation.status == 'entregando'){
                        $state.go('chooseCenter');
                    }
                });
            }

            /**
             * Salva al voluntario cuando se registra como voluntario
             */
            $scope.save = function(){
                $log.debug('saving', $scope.volunteer);
                $scope.volunteer.registeredTovolunteer = true;
                $scope.volunteer.updatedAt = moment().valueOf();
                root.child('volunteers').child($scope.volunteer.uid).set($scope.volunteer).then(function(){
                    successAlertS('Gracias por registrarte como voluntario, en cuanto nos sea posible nos pondremos en contacto contigo');
                    $state.go('chooseDonation');
                }, errAlertS);
            }

            /**
             * Login con twitter
             */
            $scope.loginWithTwitter = function(){
                $scope.auth.$signInWithRedirect('twitter').catch(errAlertS);
            }
            
            /**
             * En esta parte detectamos cuando se logea para iniciar el ctrl (solo voluntarios)
             */
            $rootScope.$on('loggedIn', function(event, logged) {
                $log.debug(logged, "loggedIn?")
                if (logged && !initiated) {
                    if(F.user.providerData[0].providerId !== 'twitter.com'){
                        $state.go('home');
                    } else {
                        init(F.user);
                    }
                }
            });
            if (F.user && !initiated) {
                if(F.user.providerData[0].providerId !== 'twitter.com'){
                    $state.go('home');
                } else {
                    init(F.user);
                }
            }
        }
    ]);