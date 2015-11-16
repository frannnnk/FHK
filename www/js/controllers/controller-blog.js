var app = angular.module('frank.controllers.blog', []);

app.controller('BlogController', function($scope,BlogService) {

	$scope.blogs = BlogService;

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
