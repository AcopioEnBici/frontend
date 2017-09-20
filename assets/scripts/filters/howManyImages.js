'use strict';

angular.module("app")
    .filter("howManyImages", [
        function(){
            return function(images){
                var howMany = 0;
                if(images){
                    if(images.logo){
                        if(images.portada){
                            howMany = 2;
                        } 
                    } else {
                        if(images.portada){
                            howMany = 1;
                        }
                    }
                } 
                return howMany;
            }
        }
    ])