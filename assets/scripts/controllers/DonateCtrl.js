/*
Victor Espinosa:im.vicoy@gmail.com
twitter:@vicoysito
*/


'use strict';

angular.module('app')
  .controller('DonateCtrl', [
    "$rootScope",
    "$scope",
    "errAlertS",
    "successAlertS",
    "NgMap",
    "AppF",
    "$document",
    function ($rootScope, $scope, errAlertS, successAlertS, NgMap, F, $document) {
      var initiated = false;
      $scope.map;
      var root = firebase.database().ref("/");
      $scope.donator = {};
      $scope.donationSent = false;
      $scope.marker;

      var init = function () {
        initiated = true;
        initMap();
      }

      var thanks = function () {
        $scope.donationSent = true;
        $scope.$apply();
      }


      $scope.save = function () {
        $scope.donator.createdAt = moment().valueOf();
        $scope.donator.status = 'esperando';
        $scope.donator.adress = $scope.addressInput;
        console.info("Donator",$scope.donator)
        console.log('saving', $scope.donator);
        root.child('donations').push($scope.donator).then(function () {
          thanks();
        }, errAlertS);
      }

      $scope.ubicateMe = function () {
        console.log('ubicating me');
      }
      var initMap = function () {
        var marker;
        var infowindow = new google.maps.InfoWindow();
        var geocoder = new google.maps.Geocoder;

        F.getLocation().then(function (myPosition) {
          var latlng = new google.maps.LatLng(myPosition.latitude, myPosition.longitude);
          var myOptions = {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.TERRAIN
          };
          $scope.map = new google.maps.Map(document.getElementById('map'), myOptions);
          marker = new google.maps.Marker({
            draggable: true,
            map: $scope.map,
            position: latlng
          });

          geocodeLatLng(geocoder, $scope.map, latlng, marker, infowindow);
          setAutocomplete($scope.map, marker, infowindow);


          $scope.loading = false;
          google.maps.event.addListenerOnce($scope.map, 'idle', function () {
            google.maps.event.trigger($scope.map, 'resize');
            $scope.map.setCenter(latlng);
          });

          // Funcion para que actualize el marker y el infoView del marcador cuando se mueve, de igual forma actualiza el modelo AdressInput
          marker.addListener('dragend', function (event) {
            geocodeLatLng(geocoder, $scope.map, event.latLng, marker, infowindow);
          });


        });


      }

      //todo: pasar a un archivo mapa utils
      // agrego el autocomplete y funcionalidad
      var setAutocomplete = function (map, marker, infowindow) {
        var input = /** @type {!HTMLInputElement} */ (
          document.getElementById('addressIn'));
        var optionsInput = {
          componentRestrictions: {
            country: 'mx'
          }
        };
        var autocomplete = new google.maps.places.Autocomplete(input, optionsInput);

        autocomplete.addListener('place_changed', function () {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // LA BUSQUEDA FALLO
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
          }

          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
          infowindow.open(map, marker);
        });
      }


      // todo:pasar a un mapa utils
      // devuelve el detalle de la ubicacion por latitud y longitud
      function geocodeLatLng(geocoder, map, latlng, marker, infowindow) {
        geocoder.geocode({
          'location': latlng
        }, function (results, status) {
          if (status === 'OK') {
            if (results[1]) {
              var detailUbicacion = results[0].formatted_address;
              $scope.addressInput = detailUbicacion;
              infowindow.setContent(detailUbicacion);
              infowindow.open(map, marker);

              // seteo la direccion a donator\
              $scope.donator.latitude = latlng.lat();
              $scope.donator.longitude = latlng.lng();
              $scope.$apply();
              return detailUbicacion;
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }

      $document.ready(function(){
        init();
      });

    }
  ]);
