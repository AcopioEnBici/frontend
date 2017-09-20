'use strict';

angular.module("app")
    .service("errAlertS", [
        "$mdToast",
        "$log",
        function($mdToast, $log) {
            return function(err) {
                if (angular.isDefined(err.code)) {
                    switch (err.code) {
                        case "EMAIL_TAKEN":
                            err = "El correo ya está en uso.";
                            break;
                        case "PERMISSION_DENIED":
                            err = "Permiso Denegado: El objeto está repetido o no cumple con las validaciones";
                            break;
                        case "INVALID_EMAIL":
                            err = "El correo no es válido";
                            break;
                        case "auth/user-not-found":
                            err = "Usuario no encontrado";
                            break;
                        case "auth/wrong-password":
                            err = "Password incorrecto";
                            break;
                        case "auth/too-many-requests":
                            err = "Se ha intentado entrar demaciadas veces con un password incorrecto. Hemos bloqueado toda petición de éste dispositivo, favor de intentar más tarde";
                            break;
                        case "auth/network-request-failed":
                            err = "Error de conexión, favor de intentar más tarde";
                            break;
                        case "storage/unauthorized":
                            err = "No autorizado";
                            break;
                        case "storage/canceled":
                            err = "Cancelado";
                            break;
                        case "storage/unknown":
                            err = "Problemas de conexión, favor de intentar más tarde";
                            break;
                        case "storage/invalid-argument":
                            err = "Archivo inválido";
                            break;
                    }
                }
                $log.error(err);

                // create toast settings object
                var toast = {
                    position: "bottom right",
                    hideDelay: 0,
                    template: '<md-toast class="error"><span flex>' + err + '</span><md-button class="md-icon-button" ng-click="closeToast()"><md-icon style="color: white" aria-label="hey" class="material-icons step">clear</md-icon></md-button></md-toast>',
                    controller: "ToastCtrl"
                };

                // show previously created toast
                $mdToast.show(toast)
            }
        }
    ])