var app = angular.module('frank.service.friend', []);

app.constant("GET_FRIENDS_SERVICES_URL", "http://www.franks.hk/FrankServlet?action=getFriendsConfig");
app.constant("SERVER_URL", "http://www.franks.hk/");

app.factory('FriendsService', function ($http, $q, GET_FRIENDS_SERVICES_URL, SERVER_URL) {
	var self = {
		'page': 0,
		'isLoading': false,
		'hasMore': true,
		'friendConfig':{},
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
		'loadConfig': function (loginEmail) {
			console.log("Login ... ");
			self.isLoading = true;
			var deferred = $q.defer();

			ionic.Platform.ready(function(){
				
				console.log("Calling api ("+loginEmail+")... ");
				$http.get(GET_FRIENDS_SERVICES_URL+ "&email="+loginEmail)
						.success(function (data) {
							self.isLoading = false;
							self.friendConfig = data;
							deferred.resolve(self.friendConfig);
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
