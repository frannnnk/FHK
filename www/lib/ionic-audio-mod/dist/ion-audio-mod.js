angular.module('ionic-audio-mod', ['ionic','ionic.utils'])
    .filter('time', function() {
        return function(input) {
            input = input || 0;

            var t = parseInt(input,10);

            var addLeadingZero = function(n) {
                return (n < 10) ? '0' + n : n;
            };
            return addLeadingZero(Math.floor(t / 60)) + ':' + addLeadingZero(t % 60);
        };
    })
    .filter('duration', ['$filter', function($filter) {
        return function (input) {
            return (input > 0) ? $filter('time')(input) : '';
        }
    }])
    .factory('MediaManager', ['$interval', '$timeout', '$window', function($interval, $timeout, $window) {
        var tracks = [], currentTrack, currentMedia, playerTimer;

        if (!$window.cordova && !$window.Media) {
            console.log("ionic-audio: missing Cordova Media plugin. Have you installed the plugin? \nRun 'ionic plugin add org.apache.cordova.media'");
            return null;
        }

        var startTimer = function() {
            if ( angular.isDefined(playerTimer) ) return;

            if (!currentTrack) return;

            playerTimer = $interval(function() {
                if ( currentTrack.duration < 0){
                    currentTrack.duration = currentMedia.getDuration();
                }

                currentMedia.getCurrentPosition(
                    // success callback
                    function(position) {
                        if (position > -1) {
                            currentTrack.progress = position;
                        }
                    },
                    // error callback
                    function(e) {
                        console.log("Error getting pos=" + e);
                    });

                if (angular.isFunction(currentTrack.onProgress))
                    currentTrack.onProgress(currentTrack.progress, currentTrack.duration);

            }, 1000);

        };

        var stopTimer = function() {
            if (angular.isDefined(playerTimer)) {
                $interval.cancel(playerTimer);
                playerTimer = undefined;
            }
        };

        var releaseMedia = function() {
            if (angular.isDefined(currentMedia)) {
                currentMedia.release();
                currentMedia = undefined;
                currentTrack = undefined;
            }
        };

        var onSuccess = function() {
            stopTimer();
            releaseMedia();

            if (angular.isFunction(this.onSuccess))
                this.onSuccess();
        };

        var onError = function() {
            if (angular.isFunction(this.onError))
                this.onError();
        };

        var onStatusChange = function(status) {
            this.status = status;

            if (angular.isFunction(this.onStatusChange))
                this.onStatusChange(status);
        };

        var createMedia = function(track) {
            if (!track.url) {
                console.log('ionic-audio: missing track url');
                return undefined;
            }

            return new Media(track.url,
                angular.bind(track, onSuccess),
                angular.bind(track, onError),
                angular.bind(track, onStatusChange));

        };

        var destroy = function() {
            stopTimer();
            releaseMedia();
        };

        var stop = function() {
            console.log('ionic-audio: stopping track ' + currentTrack.title);
            currentMedia.stop();    // will call onSuccess...

            currentTrack = undefined;
        };

        var pause = function() {
            console.log('ionic-audio: pausing track '  + currentTrack.title);

            currentMedia.pause();
            stopTimer();
        };

        var resume = function() {
            console.log('ionic-audio: resuming track ' + currentTrack.title);

            currentMedia.play();
            startTimer();
        };

        var seekTo = function(pos) {
            if (!currentMedia) return;

            currentMedia.seekTo(pos * 1000);
        };


        var play = function(track) {
            currentTrack = track;

            console.log('ionic-audio: playing track ' + currentTrack.title);
            var iOSPlayOptions = {               
                playAudioWhenScreenIsLocked : true
              }

            currentMedia = createMedia(currentTrack);
            currentMedia.play(iOSPlayOptions);

            startTimer();

        };

        /*
        Creates a new Media from a track object

         var track = {
             url: 'https://s3.amazonaws.com/ionic-audio/Message+in+a+bottle.mp3',
             artist: 'The Police',
             title: 'Message in a bottle',
             art: 'img/The_Police_Greatest_Hits.jpg'
         }
         */
        return {
            add: function(track, playbackSuccess, playbackError, statusChange, progressChange) {
                if (!track.url) {
                    console.log('ionic-audio: missing track url');
                    return;
                }
                angular.extend(track, {
                    onSuccess: playbackSuccess,
                    onError: playbackError,
                    onStatusChange: statusChange,
                    onProgress: progressChange,
                    status: 0,
                    duration: -1,
                    progress: 0
                });

                track.id  = tracks.push(track) - 1;
                return track.id;
            },

            play: function(trackID) {

                // avoid two tracks playing simultaneously
                if (currentTrack) {
                    if (currentTrack.id == trackID) {
                        if (currentTrack.status == Media.MEDIA_RUNNING) {
                            pause();
                        } else {
                            //if (currentTrack.status == Media.MEDIA_PAUSED) {
                                resume();
                            //}
                        }
                        return;
                    } else {
                        if (currentTrack.id > -1) {
                            stop();
                        }
                    }
                }

                $timeout(function() {
                    play(tracks[trackID]);
                }, 300);

            },

            pause: function() {
                pause();
            },

            seekTo: function(pos) {
                seekTo(pos);
            },

            destroy: function() {
                destroy();
            }

        }

    }])
    .directive('ionAudioTrack', ['MediaManager', '$rootScope', function(MediaManager, $rootScope) {
        return {
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            restrict: 'E',
            scope: {
                track: '='
            },
            controller: ['$scope', function($scope) {
                var controller = this;

                $scope.track.progress = 0;
                $scope.track.status = 0;
                $scope.track.duration = -1;

                var playbackSuccess = function() {
                    $scope.track.status = 0;
                    $scope.track.progress = 0;
                };
                var statusChange = function(status) {
                    $scope.track.status = status;
                };
                var progressChange = function(progress, duration) {
                    $scope.track.progress = progress;
                    $scope.track.duration = duration;
                };
                var notifyProgressBar = function() {
                    $rootScope.$broadcast('ionic-audio:trackChange', $scope.track);
                };

                this.seekTo = function(pos) {
                    MediaManager.seekTo(pos);
                };

                this.play = function() {
                    if (!MediaManager) return;

                    MediaManager.play($scope.track.id);

                    // notify global progress bar if detached from track
                    if (!controller.hasOwnProgressBar) notifyProgressBar();

                    return $scope.track.id;
                };

                this.getTrack = function() {
                    return $scope.track;
                };

                if (MediaManager) {
                    $scope.track.id = MediaManager.add($scope.track, playbackSuccess, null, statusChange, progressChange);
                }
            }],
            link: function(scope, element, attrs, controller) {
                controller.hasOwnProgressBar = element.find('ion-audio-progress-bar').length > 0;

                scope.$on('$destroy', function() {
                    MediaManager.destroy();
                });
            }
        }
    }])
    .directive('ionAudioControls', [function($localstorage) {
        return {
          restrict: 'EA',
          scope: {},
          require: ['ionAudioControls', '^^ionAudioTrack'],
          controller: ['$scope', '$q', '$timeout', '$element', '$cordovaFile', '$cordovaFileTransfer','$localstorage', function($scope, $q, $timeout, $element, $cordovaFile,  $cordovaFileTransfer, $localstorage) {
              var spinnerElem = $element.find('ion-spinner'), hasLoaded, self = this;

              spinnerElem.addClass('ng-hide');

              this.toggleSpinner = function() {
                  spinnerElem.toggleClass('ng-hide');
              };

              this.playTrack = function() {
                  if (!hasLoaded) {
                      self.toggleSpinner();
                  }
                  self.play();
              };

              this.downloadTrack = function(track) {
                var deferred = $q.defer();
                console.log('ionAudioControls now downloading '+track.title +" ID:"+ track.id +' from '+ track.remoteURL);
                ionic.Platform.ready(function(){
                    
                    var url = track.remoteURL;
                    console.log("File will be rename to "+track.uniqueName+" in device.");
                    var targetPath = cordova.file.documentsDirectory + track.uniqueName;
                    var trustHosts = true
                    var options = {};

                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                      .then(function(result) {
                        // Success!
                        $localstorage.set(track.uniqueName, 'true');
                        track.isDownloaded = true;
                        deferred.resolve(result);
                      }, function(err) {
                        // Error
                        deferred.reject(err);
                      }, function (progress) {
                        $timeout(function () {
                          track.downloadProgress = parseInt(  (progress.loaded / progress.total) * 100 , 10);
                        })
                      });

                }); //- ionic.Platform.ready
                return deferred.promise;
              };

              var unbindStatusListener = $scope.$watch('track.status', function (status) {
                  switch (status) {
                      case 1: // Media.MEDIA_STARTING
                          hasLoaded = false;
                          break;
                      case 2: // Media.MEDIA_RUNNING
                          if (!hasLoaded) {
                              self.toggleSpinner();
                              hasLoaded = true;
                          }
                          break;
                      //case 3: // Media.MEDIA_PAUSED
                      //    break;
                      case 0: // Media.MEDIA_NONE
                      case 4: // Media.MEDIA_STOPPED
                          hasLoaded = false;
                          break;
                  }
              });

              $scope.$on('$destroy', function() {
                  unbindStatusListener();
              });
          }],
          link: function(scope, element, attrs, controllers) {
              var ionAudioTrackCtrl = controllers[1];
              controllers[0].play = ionAudioTrackCtrl.play;

              scope.track = ionAudioTrackCtrl.getTrack();
          }
        }
    }])
    .directive('ionAudioPlay', ['$cordovaFile', '$cordovaFileTransfer','$localstorage', function( $cordovaFile, $cordovaFileTransfer,$localstorage) {
        return {
            //scope: true,
            restrict: 'A',
            require: ['^^ionAudioTrack', '^^ionAudioControls'],
            link: function(scope, element, attrs, controllers) {
                var isLoading, currentStatus = 0;
                var isDownloading = false;                
                
                scope.track = controllers[0].getTrack();
                
                var controller = controllers[1];

                var init = function() {
                    isLoading = false;
                    element.addClass('ion-play');
                    element.removeClass('ion-pause');
                    element.text(attrs.textPlay);
                };

                var setText = function() {
                    if (!attrs.textPlay || !attrs.textPause) return;

                    element.text((element.text() == attrs.textPlay ? attrs.textPause : attrs.textPlay));
                };

                var togglePlaying = function() {
                    element.toggleClass('ion-play ion-pause');
                    setText();
                };

                element.on('click', function() {

                    
                    // Check if file exist in device
                    ionic.Platform.ready(function(){
                        console.log('Checking file with uniqueName: '+ scope.track.uniqueName);

                        $cordovaFile.checkFile(cordova.file.documentsDirectory, scope.track.uniqueName)
                        .then(function (success) {
                            // Exist
                            console.log("File exists.");
                            scope.track.isDownloaded = true;
                            $localstorage.set(scope.track.uniqueName, 'true');

                            // Play Audio
                            if (isLoading) return;  //  debounce multiple clicks
                            controller.playTrack();
                            togglePlaying();
                            if (currentStatus == 0) isLoading = true;

                            
                          }, function (error) {
                            // Not exist, go download it
                            console.log("File not exists, now download file...");
                            $localstorage.set(scope.track.uniqueName, 'false');

                            if (isDownloading) return;  //  debounce multiple clicks                        
                            isDownloading = true;
                            controller.downloadTrack(scope.track).then(function(result){
                                console.log(scope.track.title + " ("+scope.track.uniqueName+")" + " download completed.");
                                console.log(JSON.stringify(result));
                                console.log(result.fullPath);
                                console.log(result.nativeURL);

                                isDownloading = false;
                                scope.track.isDownloaded = true;
                                
                            });

                            
                          });

                    }); //- ionic.Platform.ready

                     
                });

                var unbindStatusListener = scope.$watch('track.status', function (status) {
                    //  Media.MEDIA_NONE or Media.MEDIA_STOPPED
                    if (status == 0 || status == 4) {
                        init();
                    } else if (status == 2) {   // Media.MEDIA_RUNNING
                        isLoading = false;
                    }

                    currentStatus = status;
                });

                init();

                scope.$on('$destroy', function() {
                    unbindStatusListener();
                });
            }
        }
    }])

    
    .directive('ionAudioDownload', ['$cordovaFile', '$cordovaFileTransfer' , '$localstorage', function( $cordovaFile, $cordovaFileTransfer, $localstorage) {
        return {
            //scope: true,
            restrict: 'A',
            require: ['^^ionAudioTrack', '^^ionAudioControls'],
            link: function(scope, element, attrs, controllers) {
                var isLoading, currentStatus = 0;
                var isDownloading = false; 
                scope.track = controllers[0].getTrack();
                var controller = controllers[1];

                var init = function() {
                    isLoading = false;
                    element.addClass('ion-ios-download-outline');
                    element.removeClass('ion-load-d');
                    //element.text(attrs.textPlay);
                };


                element.on('click', function() {

                    element.addClass('ion-load-d');
                    element.removeClass('ion-ios-download-outline');

                    // Check if file exist in device
                    ionic.Platform.ready(function(){
                        console.log('Checking file with uniqueName: '+ scope.track.uniqueName);
                        $cordovaFile.checkFile(cordova.file.documentsDirectory, scope.track.uniqueName)
                        .then(function (success) {
                            // Exist
                            console.log("File exists.");
                            scope.track.isDownloaded = true;
                            $localstorage.set(scope.track.uniqueName, 'true');                            
                          }, function (error) {
                            // Not exist, go download it
                            console.log("File not exists, now download file...");
                            if (isDownloading) return;  //  debounce multiple clicks                        
                            isDownloading = true;
                            controller.downloadTrack(scope.track).then(function(result){
                                console.log(scope.track.title + " ("+scope.track.uniqueName+")" + " download completed.");
                                console.log(JSON.stringify(result));
                                console.log(result.fullPath);
                                console.log(result.nativeURL);

                                isDownloading = false;
                                scope.track.isDownloaded = true;
                                
                            });

                            
                          });

                    }); //- ionic.Platform.ready

                        
              
                });

                init();

               
            }
        }
    }])
    
    .directive('ionAudioProgressBar', ['MediaManager', function(MediaManager) {
        return {
            restrict: 'E',
            template:
                '<h2 class="ion-audio-track-info" ng-style="displayTrackInfo()">{{track.title}} - {{track.artist}}</h2>' +
                '<div class="range">' +
                '<a class="button button-icon icon" ng-class="getPlayPauseBtnClass()" ng-click="togglePlay()"></a>'+



                '<ion-audio-progress track="track"></ion-audio-progress>' +
                '<input type="range" name="volume" min="0" max="{{track.duration}}" ng-model="track.progress" on-release="sliderRelease()" disabled>' +
                '<ion-audio-duration track="track"></ion-audio-duration>' +
                '</div>',
            require: '?^^ionAudioTrack',
            scope: {},
            link: function(scope, element, attrs, controller) {
                var slider =  element.find('input'), unbindTrackListener;

                scope.track = {
                    progress: 0,
                    status: 0,
                    duration: -1
                };

                if (!angular.isDefined(attrs.displayTime)) {
                    element.find('ion-audio-progress').remove();
                    element.find('ion-audio-duration').remove();
                }
                if (!angular.isDefined(attrs.displayInfo)) {
                    element.find('h2').remove();
                }

                // hide/show track info if available
                scope.displayTrackInfo = function() {
                    return { visibility: angular.isDefined(attrs.displayInfo) && (scope.track.title || scope.track.artist) ? 'visible' : 'hidden'}
                };

                scope.getPlayPauseBtnClass = function (){
                    if (true) {
                        return "ion-pause";
                    } else {
                        return "ion-play";
                    }
                };

                scope.togglePlay = function(){
                   console.log(track.status);
                   MediaManager.pause();
                }

                // disable slider if track is not playing
                var unbindStatusListener = scope.$watch('track.status', function(status) {
                    // disable if track hasn't loaded
                    slider.prop('disabled', status == 0);   //   Media.MEDIA_NONE
                });

                if (controller) {
                    // get track from parent audio track directive
                    scope.track = controller.getTrack();
                } else {
                    // get track from current playing track elsewhere in the DOM
                    unbindTrackListener = scope.$on('ionic-audio:trackChange', function (e, track) {
                        scope.track = track;
                    });
                }

                // handle track seek-to
                scope.sliderRelease = function() {
                    var pos = scope.track.progress;
                    MediaManager.seekTo(pos);
                };

                scope.$on('$destroy', function() {
                    unbindStatusListener();
                    if (angular.isDefined(unbindTrackListener)) {
                        unbindTrackListener();
                    }
                });
            }
        }
    }])
    .directive('ionAudioProgress', [function() {
        return {
            restrict: 'E',
            scope: {
                track: '='
            },
            template: '{{track.progress | time}}'
        }
    }])
    .directive('ionAudioDuration', [function() {
        return {
            restrict: 'E',
            scope: {
                track: '='
            },
            template: '{{track.duration | duration}}'
        }
    }]);
