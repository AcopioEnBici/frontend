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
                                        }
                                        initMap();
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
             * Trae a $scope.selectedDonation la donacion
             * @param string donationId 
             */
            var getSelectedDonation = function(donationId){
                console.log("SIP", donationId);
                root.child('donations').child(donationId).once('value', function(snap){
                    $scope.selectedDonation = snap.val();
                    $scope.selectedDonation.$id = snap.key;
                    $scope.$apply();
                    console.log("COOL", $scope.selectedDonation);
                });
            }

            /**
             * Se inicializa el mapa
             */
            var initMap = function(){ 
                $scope.donationsAvailable = $firebaseArray(root.child('donations').orderByChild('status').equalTo('esperando'));
            }

            /**
             * Se obtienen las donaciones cercanas
             */
            var getNearestDonations = function(){
                var position = $scope.map.markers['myPosition'].getPosition();
                $scope.currentP = {
                    latitude: position.lat(), 
                    longitude: position.lng()
                }
                $scope.nearestDonations = geoDistanceFilter($scope.donationsAvailable, $scope.currentP, $scope.distanceFromMe);
            }

            /**
             * Se observa el marcador con mi posicion y entonces se obtienen las donaciones cercanas
             */
            var watchMarkersThenInit = function(){
                console.log('listening for markers My position', $scope.map.markers.myPosition)
                $scope.$watch('map.markers.myPosition', function(myPosition){
                    if(myPosition){
                        getNearestDonations();
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
                }, errAlertS);
            }

            /**
             * Login con twitter
             */
            $scope.loginWithTwitter = function(){
                $scope.auth.$signInWithRedirect('twitter').catch(errAlertS);
            }

            /**
             * Cuando se entrega la donación al centro
             */
            $scope.deliverDonation = function(){
                $scope.selectedDonation.status = 'entregado';
                $scope.selectedDonation.deliveredAt = $scope.selectedCenter.name;
                $scope.selectedDonation.deliveredBy = F.user.uid;
                saveVolunteer(null, 'selectedDonation').then(function(){
                    saveDonation($scope.selectedDonation, 'Gracias!! Se entrego la donación correctamente!');
                    $scope.$apply();
                });
            }

            /**
             * Cuando se recoge la donacion
             */
            $scope.pickupDonation = function(){
                $scope.selectedDonation.status = 'recogido';
                $scope.selectedDonation.pickedBy = F.user.uid;
                saveDonation($scope.selectedDonation, 'Gracias!! Se entrego la donación correctamente!');
            }

            /**
             * Cuando se cancela recoger la donación
             */
            $scope.cancelPickup = function(){
                $scope.selectedDonation.status = 'esperando';
                saveVolunteer(null, 'selectedDonation').then(function(){
                    saveDonation($scope.selectedDonation, 'Se canceló que recogieras esa donación');
                    $scope.selectedDonation = false;
                    $scope.$apply();    
                });
            }

            /**
             * Cuando se seleccióna una donación a la cual recoger
             */
            $scope.selectPoint = function(ev, point){
                console.log(point, i, "select point");
                $scope.selectedDonation = point;
                $scope.selectedDonation.status = 'recogiendo';
                saveVolunteer($scope.selectedDonation.$id, 'selectedDonation').then(function(){
                    saveDonation($scope.selectedDonation, 'Escogiste una donación');
                    $scope.$apply();
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
             * Cuando el documento esta listo, observamos $scope.donationsAvailable y $scope.map.markers.myPosition para inicializar la logica del mapa
             */
            $document.ready(function(){
                var getNearestWatcher = $scope.$watchGroup(['donationsAvailable', 'map.markers.myPosition'], function(all){
                    if(all[0] && all[1]){
                        if($scope.donationsAvailable.length) {
                            watchMarkersThenInit()
                            getNearestWatcher();
                        }
                    }
                },1);
            });
            
            /**
             * En esta parte detectamos cuando se logea para iniciar el ctrl
             */
            $rootScope.$on('loggedIn', function(event, logged) {
                $log.debug(logged, "loggedIn?")
                if (logged && !initiated) init(F.user);
            });
            if (F.user && !initiated) {
                init(F.user);
            }
        }
    ]);