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
        function($rootScope, $scope, $log, successAlertS, errAlertS, $firebaseAuth, $state, $q, F) {
            var initiated = false;
            $scope.volunteer = {};
            var root = firebase.database().ref('/');
            $scope.auth = $firebaseAuth();
            $scope.distanceFromMe = 10;
            $scope.distanceForCenters = 100;
            $scope.selectedDonation = false;
            $scope.selectedCenter = false;

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

            $scope.deliverDonation = function(){
                $scope.selectedDonation.status = 'entregado';
                $scope.selectedDonation.deliveredAt = $scope.selectedCenter.$id;
                $scope.deliveredBy = F.user.uid;
                $scope.updatedAt = moment().valueOf();
                $scope.selectedDonation.$save().then(function(){
                    successAlertS('Gracias!! Se entrego la donación correctamente!');
                }, errAlertS);
            }

            $scope.pickupDonation = function(){
                $scope.selectedDonation.status = 'recogido';
                // $scope.selectedDonation.deliveredAt = $scope.selectedCenter.$id;
                $scope.pickedBy = F.user.uid;
                $scope.updatedAt = moment().valueOf();
                $scope.selectedDonation.$save().then(function(){
                    successAlertS('Gracias!! Se entrego la donación correctamente!');
                }, errAlertS);
            }

            $scope.cancelPickup = function(){
                $scope.selectedDonation.status = null;
                $scope.updatedAt = moment().valueOf();
                $scope.selectedDonation.$save().then(function(){
                    successAlertS('Se canceló el acopio de la donación');
                }, errAlertS);
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
                // @todo cambiar esto por la llamada a donaciones con status correcto para ser recogidas
                $scope.donationsAvailable = [
                    { latitude: 67.331, longitude: 56.214 },
                    { latitude: 67.331, longitude: 56.214 },
                    { latitude: 67.331, longitude: 56.214 },
                    { latitude: 67.331, longitude: 56.214 },
                    { latitude: 67.331, longitude: 56.214 },
                    { latitude: 67.331, longitude: 56.214 },
                    { latitude: 67.331, longitude: 56.214 },
                    { latitude: 67.331, longitude: 56.214 },
                    { latitude: 67.331, longitude: 56.214 },
                ];
                $scope.donationsAvailable = $firebaseArray(root.child('donations').orderByChild('status').equalTo('esperando'))

                $scope.centersAvailable = $firebaseArray(root.child('centers').orderByChild('active').equalTo(true));
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
        }
    ]);