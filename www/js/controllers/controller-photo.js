var app = angular.module('frank.controllers.photo', ['ion-gallery']);

app.config(function(ionGalleryConfigProvider) { ionGalleryConfigProvider.setGalleryConfig({ action_label: 'Close', toggle: false, row_size: 3 }); });

app.controller('PhotoController', function($scope,PhotoService) {

	// API: http://www.franks.hk/FrankServlet?action=getInstagramImage&limit=1&seq=2
	//PhotoService.loadFeed();

	$scope.photos = PhotoService;

	$scope.doRefresh = function(){
		if (!$scope.photos.isLoading) {
			$scope.photos.refresh().then(function(){
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	};
	$scope.loadMore = function(){
		console.log("Load More");
		if (!$scope.photos.isLoading && $scope.photos.hasMore) {
			$scope.photos.next().then(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}
	};

  
});
