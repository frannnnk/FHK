var app = angular.module('frank.controllers.podcast', ['ionic-audio-mod']);

app.controller('PodcastController', function($scope, $ionicLoading,PodcastService) {
	// Plugin: http://arielfaur.github.io/ionic-audio/
	// Media URL: http://www.franks.hk/FrankServlet?action=getPodcastJSON&seq=0&limit=5

	$ionicLoading.show({template:'Loading...'});
	$scope.podcasts = PodcastService;
	$scope.podcasts.load().then(function(){
		$ionicLoading.hide();
	});

	$scope.$on('$ionicView.enter', function() {
	    //analytics.trackView('Screen Title');
	    console.log("podcast list enter");
	    $(".tab-nav.tabs").slideDown("fast");
	});
	$scope.$on('$ionicView.leave', function() {
	    //analytics.trackView('Screen Title');
	    console.log("podcast list leave");
	});

	$scope.doRefresh = function(){
		if (!$scope.podcasts.isLoading) {
			$scope.podcasts.refresh().then(function(){
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	};
	$scope.loadMore = function(){
		console.log("Load More");
		if (!$scope.podcasts.isLoading && $scope.podcasts.hasMore) {
			$scope.podcasts.next().then(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}
	};
	$scope.download = function(track){
		console.log("Downloading "+track.title+" "+track.url);
		
		$scope.podcasts.download(track).then(function(result){
			console.log(track.title + " ("+track.uniqueName+")" + " download completed.");
			console.log(JSON.stringify(result));
			console.log(result.fullPath);
			console.log(result.nativeURL);

			
		});
		
	};
	$scope.checkFile = function(track){
		
		$scope.podcasts.checkFile(track);
		
	};


  
});
