'use strict';

angular.module("app")
    .constant('loginRedirectPath', 'admin.login')
    .constant('allowedOfflineStates', ['admin.login','admin.register','home','donate','deliver','admin.logout'])
    .constant('FB_CONFIG', {
        apiKey: "AIzaSyDR-aACSORClSwkE0CcZs8aAmKawIKDYH8",
        authDomain: "acopio-en-bici.firebaseapp.com",
        databaseURL: "https://acopio-en-bici.firebaseio.com",
        projectId: "acopio-en-bici",
        storageBucket: "acopio-en-bici.appspot.com",
        messagingSenderId: "669726958713"
    });