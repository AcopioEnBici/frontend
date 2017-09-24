'use strict';

angular.module('app')
    .factory('AppF', [
        "$state",
        "errAlertS",
        "$q",
        function(
            $state,
            errAlertS,
            $q
        ) {
            var obj = {
                paginate: 5,
                recycleDays: 30,
                inModule: 'site',
                user: false,
                contactFormUrl: "/contacto.php",
                goto: function(state) {
                    $state.go(state);
                },
                getSelected: function(array) {
                    var selected = [];
                    for (var a in array) {
                        if (array[a].selected) selected.push(array[a]);
                    }
                    return selected;
                },
                somethingIsSelected: function(objects) {
                    for (var a in objects) {
                        if (objects[a].selected) return true;
                    }
                    return false;
                },
                getLocation: function(){
                    var promise = $q.defer();
                    if(obj.myPosition){
                        promise.resolve(obj.myPosition);
                    } else {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(position){
                                obj.myPosition = {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude
                                }
                                console.log(position, "ALMENOS")
                                promise.resolve(obj.myPosition);
                            }, function(err){
                                promise.reject(err);
                            });
                        } else {
                            promise.reject("Geolocation no está soportada en su navegador.")
                        }
                    }
                    return promise.promise;
                }
            };

            return obj;
        }
    ]);