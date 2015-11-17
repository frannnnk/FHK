var app = angular.module('frank.controllers.blog', []);

app.controller('BlogController', function($scope, $ionicLoading, BlogService) {

	$ionicLoading.show({template:'Loading...'});
	$scope.blogs = BlogService;
	$scope.blogs.load().then(function(){
		$ionicLoading.hide();
	});

	$scope.$on('$ionicView.enter', function() {
	    //analytics.trackView('Screen Title');
	    console.log("blog list enter");
	     $(".tab-nav.tabs").fadeIn("fast");
	});

	$scope.doRefresh = function(){
		if (!$scope.blogs.isLoading) {
			$scope.blogs.refresh().then(function(){
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	};
	$scope.loadMore = function(){
		console.log("Load More");
		if (!$scope.blogs.isLoading && $scope.blogs.hasMore) {
			$scope.blogs.next().then(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}
	};
  
});
