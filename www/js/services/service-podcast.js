var app = angular.module('frank.service.podcast', []);

app.constant("MEDIA_FEED_URL", "http://www.franks.hk/FrankServlet?action=getPodcastJSON&getcontent=false");
app.constant("SERVER_URL", "http://www.franks.hk/");

app.factory('PodcastService', function ($http, $q, MEDIA_FEED_URL, SERVER_URL) {


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
									track.url = entry.mediaURL;
									track.artist = 'Frank';
									track.title = entry.title;
									track.art = entry.indexImagePath;
									track.desc = entry.desc;
									track.publishDate = entry.publishDate;

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
		}
	};


	//self.load();


	return self;
});
