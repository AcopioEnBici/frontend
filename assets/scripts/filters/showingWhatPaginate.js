'use strict';

angular.module('app')
    .filter('showingWhatPaginate', [
        function(){
            return function(page, paginate, array, total){
                var firstRecord, lastRecord;
                firstRecord = (page > 1) ? ((page-1) * paginate) + 1 : 1;
                if(page > 1){
                    lastRecord = (firstRecord+((array.length<paginate) ? array.length : paginate))-1;
                } else {
                    lastRecord = (array.length<paginate) ? array.length : paginate;
                }
                var final = firstRecord + "-" + lastRecord + " de " + total;
                return final;
            }
        }
    ]);