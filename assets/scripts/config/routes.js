'use strict';

angular.module("app")
    .config([
        "$stateProvider",
        "$urlRouterProvider",
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/inicio',
                    templateUrl: 'partials/home/index.html',
                    controller: 'HomeCtrl'
                })
                .state('donate', {
                    url: '/donar',
                    templateUrl: 'partials/home/donate.html',
                    controller: 'DonateCtrl'
                })
                .state('deliver', {
                    url: '/entregar',
                    templateUrl: 'partials/home/volunteer.html',
                    controller: 'VolunteerCtrl'
                })
                .state('admin', {
                    url: '/admin',
                    templateUrl: 'partials/admin/index.html',
                    controller: 'AdminCtrl'
                })
                .state('admin.login', {
                    url: '/login',
                    templateUrl: 'partials/admin/login.html',
                    controller: 'AdminLoginCtrl'
                })
                .state('admin.donations', {
                    url: '/donaciones',
                    templateUrl: 'partials/admin/donations.html',
                    controller: 'AdminDonationsCtrl'
                })
                .state('admin.volunteers', {
                    url: '/voluntarios',
                    templateUrl: 'partials/admin/volunteers.html',
                    controller: 'AdminVolunteersCtrl'
                })
                .state('admin.centers', {
                    url: '/centros-de-acopio',
                    templateUrl: 'partials/admin/centers.html',
                    controller: 'AdminCentersCtrl'
                })
                .state('admin.main', {
                    url: '/main',
                    templateUrl: 'partials/admin/main.html',
                    controller: 'AdminMainCtrl'
                })
                .state('admin.logout', {
                    url: '/login',
                    templateUrl: 'partials/admin/logout.html',
                    controller: 'AdminLogoutCtrl'
                })
                .state('admin.register', {
                    url: '/registro',
                    templateUrl: 'partials/admin/register.html',
                    controller: 'AdminRegisterCtrl'
                })
                .state('centers', {
                    url: '/centers',
                    templateUrl: 'partials/admin/centers.html'
                })
                // cruds
                // .state('admin.cruds', {
                //     url: '/cruds',
                //     templateUrl: 'partials/admin/cruds.html',
                //     controller: 'CrudsCtrl'
                // })

            $urlRouterProvider.otherwise('/inicio');
        }
    ]);
