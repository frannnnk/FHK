var app = angular.module('frank.service.englishpod', []);

app.constant("ENGLISHPOD_FEED_URL", "http://www.franks.hk/FrankServlet?action=getUserEPHistory");
app.constant("SERVER_URL", "http://www.franks.hk/");

app.factory('EnglishPodService', function ($http, $q, $timeout, $cordovaFile, $localstorage, $cordovaFileTransfer, ENGLISHPOD_FEED_URL, SERVER_URL) {

	//&user=frank@franks.hk&seq=0&limit=1
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
		'load': function (email) {
			self.isLoading = true;
			var deferred = $q.defer();

			ionic.Platform.ready(function(){
				
				$http.get(ENGLISHPOD_FEED_URL+ "&user="+email+"&limit=5&seq="+self.page)
						.success(function (data) {
							self.isLoading = false;
							

							if (data.length == 0) {
								self.hasMore = false;
							} else {
								angular.forEach(data, function (entry) {
									

									var track = {};									
									track.remoteURL = entry.mp3Path;
									track.artist = 'English Pod';
									track.title = entry.title;
									track.art = "http://www.franks.hk/images/ep.jpg";
									track.desc = entry.level;
									track.level = entry.level;
									track.createDate = entry.createDate;
									track.mp3Path=entry.mp3Path;
									track.pdf3Path=entry.pdf3Path;
									track.fileId=entry.fileId;
									track.downloadProgress = 0;
									track.id = "englishpod_"+entry.fileId;
									track.uniqueName = track.id+'.'+(track.remoteURL.split('.')[track.remoteURL.split('.').length-1]);
									track.url = "documents://"+track.uniqueName;

									if ( "true" == $localstorage.get(track.uniqueName)) {
 										track.isDownloaded = true;
									} else {
										track.isDownloaded = false;
									}

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

			console.log('Englishpod Service now downloading '+track.title +" ID:"+ track.id +' from '+ track.url);

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
