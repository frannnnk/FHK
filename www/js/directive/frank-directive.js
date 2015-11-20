angular.module('ionic-frank-directive', ['ionic','ionic.utils'])
 .directive('ionFrankProgressBarLine', [function() {
        return {
            restrict: 'E',
            template:
                '<div>12345678'+
              
                '</div>',
            require: '^ngModel',
            //scope: {},
            link: function(scope, element, attrs, controller) {
                //var slider =  element.find('input'), unbindTrackListener;
                /*
                scope.displayTrackInfo = function() {
                    return { visibility: angular.isDefined(attrs.displayInfo) && (scope.track.title || scope.track.artist) ? 'visible' : 'hidden'}
                };
                */

                //alert(scope.serv.serviceName);
                console.log(scope.serv.serviceName);

                scope.$on('$destroy', function() {
                    
                });
            }
        }
    }]);