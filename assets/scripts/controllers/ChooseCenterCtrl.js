'use strict';

angular.module('app')
    .controller('ChooseCenterCtrl', [
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
        "NgMap",
        "$document",
        "geoDistanceFilter",
        function($rootScope, $scope, $log, successAlertS, errAlertS, $firebaseAuth, $state, $q, F, $firebaseArray, NgMap, $document, geoDistanceFilter) {
            var initiated = false;
            $scope.volunteer = {};
            var root = firebase.database().ref('/');
            $scope.auth = $firebaseAuth();
            $scope.distanceFromMe = 10;
            $scope.distanceForCenters = 100;
            $scope.selectedDonation = false;
            $scope.selectedCenter = false;
            $scope.map;

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
                                            getSelectedDonation($scope.volunteer.selectedDonation);
                                            initMap();
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
                var promise = $q.defer();
                donation.updatedAt = moment().valueOf();
                var id = angular.copy(donation.$id);
                delete donation.$id;
                delete donation.$priority;
                delete donation.distance; // se le agrega distance por el filtro de geoLocation
                console.log(donation,id, 'saving donation');
                root.child('donations').child(id).set(donation).then(function(){
                    donation.$id = id;
                    successAlertS(successMsg);
                    promise.resolve(true);
                }, function(err){
                    errAlertS(err);
                    promise.reject(err);
                });

                return promise.promise;
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

            var getSelectedCenter = function(centerId){
                console.log("getSelectedCenter", centerId);
                root.child('centers').child(centerId).once('value', function(snap){
                    $scope.selectedCenter = snap.val();
                    $scope.selectedCenter.$id = snap.key;
                    $scope.$apply();
                });
            }

            /**
             * Trae a $scope.selectedDonation la donacion
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
                    } else {
                        if($scope.selectedDonation.hasOwnProperty('deliverAt')){
                            getSelectedCenter($scope.selectedDonation.deliverAt);
                        }
                    }
                });
            }

            /**
             * Se inicializa el mapa
             */
            var initMap = function(){ 
                $scope.centersAvailable = $firebaseArray(root.child('centers'));
                $scope.centersAvailable.$loaded().then(function(){
                    getNearestCenters()
                });
            }

            /**
             * Se obtienen los centros cercanos
             */
            var getNearestCenters = function(){
                $scope.nearestCenters = $scope.centersAvailable;
                console.log($scope.nearestCenters, $scope.map.markers, "COOL")
            }

            /**
             * Cuando se entrega la donación al centro
             */
            $scope.deliverDonation = function(){
                $scope.selectedDonation.status = 'entregado';
                $scope.selectedDonation.deliveredBy = F.user.uid;
                saveVolunteer(null, 'selectedDonation').then(function(){
                    saveDonation($scope.selectedDonation, 'Gracias!! Se entrego la donación correctamente!').then(function(){
                        $state.go('chooseDonation');
                    });
                });
            }

            /**
             * Cuando se cancela recoger la donación
             */
            $scope.cancelPickup = function(){
                $scope.selectedDonation.status = 'esperando';
                $scope.selectedDonation.deliverAt = null;
                saveVolunteer(null, 'selectedDonation').then(function(){
                    saveDonation($scope.selectedDonation, 'Se canceló que recogieras esa donación').then(function(){
                        $scope.selectedDonation = false;
                        $state.go('chooseDonation'); // se regresa al paso anterior   
                    });
                });
            }

            /**
             * Cuando se seleccióna un centro a la cual entregar
             */
            $scope.selectCenter = function(ev, point){
                console.log(point, i, "select point");
                $scope.selectedCenter = point;
                $scope.selectedDonation.status = 'entregando';
                $scope.selectedDonation.deliverAt = $scope.selectedCenter.$id;
                saveVolunteer($scope.selectedDonation.$id, 'selectedDonation').then(function(){
                    saveDonation($scope.selectedDonation, 'Escogiste un centro').then(function(){
                        
                    });
                });
            }

            /**
             * Se inicializa el mapa para ponerlo en scope 
             * Probablemente necesitemos hacer lo mismo con los otros mapas
             */
            NgMap.getMap("map").then(function(evtMap){
                $scope.map = evtMap;
            });
            
            /**
             * En esta parte detectamos cuando se logea para iniciar el ctrl
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
            var initWatcher = $scope.$watch('F.user.providerData[0].providerId', function(providerId){
                if(providerId){
                    if(providerId !== 'twitter.com'){
                        $state.go('home');
                    } else if(!initiated) {
                        init(F.user);
                        initWatcher();
                    }
                }
            });
        }
    ]);