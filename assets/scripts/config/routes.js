'use strict';

angular.module("app")
    .config([
        "$stateProvider",
        "$urlRouterProvider",
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/',
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
                .state('chooseDonation', {
                    url: '/selecciona-donacion',
                    templateUrl: 'partials/home/1-choose-donation.html',
                    controller: 'ChooseDonationCtrl'
                })
                .state('chooseCenter', {
                    url: '/selecciona-centro-de-acopio',
                    templateUrl: 'partials/home/2-choose-center.html',
                    controller: 'ChooseCenterCtrl'
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
                    url: '/logout',
                    templateUrl: 'partials/admin/logout.html',
                    controller: 'AdminLogoutCtrl'
                })
                .state('admin.register', {
                    url: '/registro',
                    templateUrl: 'partials/admin/register.html',
                    controller: 'AdminRegisterCtrl'
                })
                .state('admin.staff', {
                    url: '/staff',
                    templateUrl: 'partials/admin/staff.html',
                    controller: 'AdminStaffCtrl'
                })
                .state('404', {
                    url: '/404',
                    templateUrl: '404.html'
                })

                // cruds
                // .state('admin.cruds', {
                //     url: '/cruds',
                //     templateUrl: 'partials/admin/cruds.html',
                //     controller: 'CrudsCtrl'
                // })

            $urlRouterProvider.when('', '/');
            $urlRouterProvider.otherwise('/404');
        }
    ]);
