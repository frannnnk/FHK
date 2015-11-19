var app = angular.module('frank.service.podcast', []);

app.constant("MEDIA_FEED_URL", "http://www.franks.hk/FrankServlet?action=getPodcastJSON&getcontent=false");
app.constant("SERVER_URL", "http://www.franks.hk/");

app.factory('PodcastService', function ($http, $q, $timeout, $cordovaFile,  $cordovaFileTransfer, MEDIA_FEED_URL, SERVER_URL) {


	var self = {
		'page': 0,
		'isLoading': false,
		'hasMore': true,
		'results': [],
		'refresh': function () {
			self.page = 0;
			self.isLoading = false;
			self.hasMore = true;
			self.results = [];
			return self.load();
		},
		'next': function () {
			self.page += 1;
			return self.load();
		},
		'load': function () {
			self.isLoading = true;
			var deferred = $q.defer();

			ionic.Platform.ready(function(){
				
				$http.get(MEDIA_FEED_URL+ "&limit=5&seq="+self.page)
						.success(function (data) {
							self.isLoading = false;
							

							if (data.length == 0) {
								self.hasMore = false;
							} else {
								angular.forEach(data, function (entry) {
									//console.log(entry);
									if (entry.indexImagePath) {
										entry.indexImagePath = entry.indexImagePath+"?"+Math.random();
									}

									var track = {};									
									track.remoteURL = entry.mediaURL;
									track.artist = 'Frank';
									track.title = entry.title;
									track.art = entry.indexImagePath;
									track.desc = entry.desc;
									track.publishDate = entry.publishDate;
									track.downloadProgress = 0;
									track.id = "podcast_"+entry.id;
									track.uniqueName = track.id+'.'+(track.remoteURL.split('.')[track.remoteURL.split('.').length-1]);
									track.isDownloaded = false;
									track.url = "documents://"+track.uniqueName;

									// Check file existence in device?
									// Check data to localStrorage?  

									self.results.push(track);
								});
							}

							deferred.resolve();
						})
						.error(function (data, status, headers, config) {
							self.isLoading = false;
							deferred.reject(data);
						});

			}); //- ionic.Platform.ready
			return deferred.promise;
		},
		'download': function (track) {
			var deferred = $q.defer();

			console.log('Service now downloading '+track.title +" ID:"+ track.id +' from '+ track.url);

			ionic.Platform.ready(function(){
				
				var url = track.url;
				console.log("File will be rename to "+track.uniqueName+" in device.");
			    var targetPath = cordova.file.documentsDirectory + track.uniqueName;
			    var trustHosts = true
			    var options = {};

			    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
			      .then(function(result) {
			        // Success!
			        deferred.resolve(result);
			      }, function(err) {
			        // Error
			        deferred.reject(err);
			      }, function (progress) {
			        $timeout(function () {
			          track.downloadProgress = (progress.loaded / progress.total) * 100;
			        })
			      });

			}); //- ionic.Platform.ready
			return deferred.promise;
		},
		'checkFile': function (track) {
			var deferred = $q.defer();


			ionic.Platform.ready(function(){
			    console.log('Checking file with uniqueName: '+ track.uniqueName+ ' Path:'+cordova.file.documentsDirectory+track.uniqueName);

			    $cordovaFile.checkFile(cordova.file.documentsDirectory, track.uniqueName)
			    .then(function (success) {
			        // success
			        console.log("Check result:"+JSON.stringify(success));
			        deferred.resolve(success);
			      }, function (error) {
			        // error
			        console.log("Check result:"+JSON.stringify(error));
			        deferred.reject(error);
			      });

			}); //- ionic.Platform.ready
			return deferred.promise;
		}
	};


	//self.load();


	return self;
});
