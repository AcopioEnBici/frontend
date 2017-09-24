'use strict';

angular.module('app')
    .controller('ChooseDonationCtrl', [
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
            $scope.selectedDonation = false;
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
                                        if(volunteer.active) $scope.loading = true;
                                        if($scope.volunteer.hasOwnProperty('selectedDonation')){
                                            getSelectedDonation($scope.volunteer.selectedDonation);
                                        }
                                        getMapInfo();
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
                    promsise.reject(err);
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
                    if($scope.selectedDonation.status == 'recogido' || $scope.selectedDonation.status == 'entregando'){
                        $state.go('chooseCenter');
                    }
                });
            }

            var addMarker = function(lat, lng, name, place){
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat,lng),
                    map: $scope.map,
                    title: name
                });
                google.maps.event.addListener(marker, 'click', function(){
                    $scope.selectDonation(place);
                });
            }

            var initMap = function(){
                F.getLocation().then(function(myPosition){
                    var latlng = new google.maps.LatLng(myPosition.latitude,myPosition.longitude);
                    var myOptions = {
                        zoom: 14,
                        center: latlng,
                        mapTypeId: google.maps.MapTypeId.TERRAIN
                    };
                    $scope.map = new google.maps.Map(document.getElementById('map'),myOptions);
                    $scope.nearestDonations = geoDistanceFilter($scope.donationsAvailable, myPosition, $scope.distanceFromMe);
                    for (var d in $scope.nearestDonations){
                        var donation = $scope.nearestDonations[d];
                        addMarker(donation.latitude, donation.longitude, donation.name + ' - ' + donation.categoryOfDonations, donation);
                    }
        
                    $scope.loading = false;
                    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
                        google.maps.event.trigger($scope.map, 'resize');
                        $scope.map.setCenter(latlng);
                    });
                });
            }

            /**
             * Se inicializa el mapa
             */
            var getMapInfo = function(){ 
                $scope.donationsAvailable = $firebaseArray(root.child('donations').orderByChild('status').equalTo('esperando'));
                $scope.donationsAvailable.$loaded().then(function(){
                    initMap();
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
             * Cuando se recoge la donacion
             */
            $scope.pickupDonation = function(){
                $scope.selectedDonation.status = 'recogido';
                $scope.selectedDonation.pickedBy = F.user.uid;
                saveDonation($scope.selectedDonation, 'Gracias!! Se recogiste la donación, ahora solo debes llevarla a un centro de acopio').then(function(){
                    $state.go('chooseCenter');
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
                    });
                    
                });
            }

            /**
             * Cuando se seleccióna una donación a la cual recoger
             */
            $scope.selectDonation = function(point){
                $scope.loading = true;
                console.log(point, "select point");
                $scope.selectedDonation = point;
                $scope.selectedDonation.status = 'recogiendo';
                saveVolunteer($scope.selectedDonation.$id, 'selectedDonation').then(function(){
                    saveDonation($scope.selectedDonation, 'Escogiste una donación').then(function(){
                        $scope.loading = false;
                    });
                });
            }

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
                    } else {
                        init(F.user);
                        initWatcher();
                    }
                }
            });
        }
    ]);