var app = angular.module('frank.service.photo', []);

app.constant("PHOTO_FEED_URL", "http://www.franks.hk/FrankServlet?action=getInstagramImage");
app.constant("SERVER_URL", "http://www.franks.hk/");

app.factory('PhotoService', function ($http, $q, PHOTO_FEED_URL, SERVER_URL) {

	

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
				
				$http.get(PHOTO_FEED_URL+ "&limit=24&seq="+self.page)
						.success(function (data) {
							self.isLoading = false;
							

							if (data.length == 0) {
								self.hasMore = false;
							} else {
								angular.forEach(data, function (entry) {
									if (entry.highServerUrl) {
										entry.src = SERVER_URL+entry.lowServerUrl+"?"+Math.random();
										entry.highResSrc = SERVER_URL+entry.highServerUrl+"?"+Math.random();
										entry.sub = entry.caption; 
									}
									self.results.push(entry);
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


	self.load();


	return self;
});
