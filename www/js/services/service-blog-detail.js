var app = angular.module('frank.service.blog.detail', []);

app.constant("BLOG_POST_URL", "http://www.franks.hk/FrankServlet?action=getPublishedBlogJSONById");
app.constant("SERVER_URL", "http://www.franks.hk/");
app.factory('BlogDetailService', function ($http, $q, BLOG_POST_URL, SERVER_URL) {


	var self = {
		'entry': {},
		'load': function (id) {
			self.isLoading = true;
			var deferred = $q.defer();

			ionic.Platform.ready(function(){
				
				$http.get(BLOG_POST_URL+ "&id="+id)
						.success(function (data) {
							self.isLoading = false;
							if (data) {
								self.entry = data;
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
	return self;
});
