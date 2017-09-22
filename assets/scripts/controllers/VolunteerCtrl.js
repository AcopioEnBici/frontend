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

            $scope.save = function(){
                $log.debug('saving', $scope.volunteer);
                $scope.volunteer.registeredTovolunteer = true;
                $scope.volunteer.updatedAt = moment().valueOf();
                root.child('volunteers').child($scope.volunteer.uid).set($scope.volunteer).then(function(){
                    successAlertS('Gracias por registrarte como voluntario, en cuanto nos sea posible nos pondremos en contacto contigo');
                }, errAlertS);
                
            }

            $scope.loginWithTwitter = function(){
                $scope.auth.$signInWithRedirect('twitter').catch(errAlertS);
            }

            var saveDonation = function(donation, successMsg){
                donation.updatedAt = moment().valueOf();
                var id = angular.copy(donation.$id);
                delete donation.$id;
                delete donation.$priority;
                delete donation.distance; // se le agrega distance por el filtro de geoLocation
                console.log(donation, 'saving donation');
                root.child('donations').child(id).set(donation).then(function(){
                    successAlertS(successMsg);
                }, errAlertS);
            }

            $scope.deliverDonation = function(){
                $scope.selectedDonation.status = 'entregado';
                $scope.selectedDonation.deliveredAt = $scope.selectedCenter.$id;
                $scope.selectedDonation.deliveredBy = F.user.uid;
                saveDonation($scope.selectedDonation, 'Gracias!! Se entrego la donación correctamente!');
            }

            $scope.pickupDonation = function(){
                $scope.selectedDonation.status = 'recogido';
                $scope.selectedDonation.pickedBy = F.user.uid;
                saveDonation($scope.selectedDonation, 'Gracias!! Se entrego la donación correctamente!');
            }

            $scope.cancelPickup = function(){
                $scope.selectedDonation = false;
                // saveDonation($scope.selectedDonation, 'Se canceló el acopio de la donación');
            }

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

            var initMap = function(){ 
                $scope.donationsAvailable = $firebaseArray(root.child('donations').orderByChild('status').equalTo('esperando'));
            }

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

            $rootScope.$on('loggedIn', function(event, logged) {
                $log.debug(logged, "loggedIn?")
                if (logged && !initiated) init(F.user);
            });

            if (F.user && !initiated) {
                init(F.user);
            }

            $scope.selectPoint = function(ev, point){
                console.log(point, i, "select point");
                if(point != $scope.selectedDonation) $scope.selectedDonation = point;
                else $scope.selectedDonation = false;
                $scope.$apply();
            }

            var getNearestDonations = function(){
                var position = $scope.map.markers['myPosition'].getPosition();
                $scope.currentP = {
                    latitude: position.lat(), 
                    longitude: position.lng()
                }
                $scope.nearestDonations = geoDistanceFilter($scope.donationsAvailable, $scope.currentP, $scope.distanceFromMe);
            }

            var watchMarkersThenInit = function(){
                console.log('listening for markers My position', $scope.map.markers.myPosition)
                $scope.$watch('map.markers.myPosition', function(myPosition){
                    if(myPosition){
                        getNearestDonations();
                    }
                });
            }

            NgMap.getMap("map").then(function(evtMap){
                $scope.map = evtMap;
            });

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
        }
    ]);