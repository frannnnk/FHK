angular.module('ionic-frank-directive', ['ionic','ionic.utils'])
 .directive('frankProgressBarLine', [function() {

        var eleID = 'e'+parseInt(Math.random()*1000000,10);
        return {
            restrict: 'E',
            template:
                '<div id="'+eleID+'">'+
                '<span style="font-size:80%;">{{percentageCompleted}}% Completed</span>'+
                '</div>',
            require: ['^progressTotal','^progressCurrent'],
            scope:{
                 progressTotal: '@',
                 progressCurrent: '@'
            },
            //scope: {},
            link: function(scope, element, attrs, controller) {
                //var slider =  element.find('input'), unbindTrackListener;
                /*
                scope.displayTrackInfo = function() {
                    return { visibility: angular.isDefined(attrs.displayInfo) && (scope.track.title || scope.track.artist) ? 'visible' : 'hidden'}
                };
                */

                var progTotal = parseInt(scope.progressTotal,10);
                var progCurrent = parseInt(scope.progressCurrent,10);
                scope.percentageCompleted = parseInt(progCurrent/progTotal*100,10);

                var line = new ProgressBar.Line("#"+eleID, {
                    color: '#4da6ff',
                    trailColor: '#eee',
                    trailWidth: 1,
                    duration: 3000,
                    easing: 'bounce'

                });

                line.animate(progCurrent/progTotal);  // Number from 0.0 to 1.0


                scope.$on('$destroy', function() {
                    
                });
            }
        }
    }])
 .directive('progressTotal', function() {
  return {
    restrict: 'A',
    controller: function($scope) {}
  }
})
.directive('progressCurrent', function() {
  return {
    restrict: 'A',
    controller: function($scope) {}
  }
});