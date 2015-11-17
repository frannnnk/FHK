var app = angular.module('frank.controllers.blog.detail', []);

app.controller('BlogDetailController', function($scope,$ionicLoading,$stateParams,BlogDetailService) {
	$scope.postId = $stateParams.id;
	console.log("ID:"+$scope.postId);

	$ionicLoading.show({template:'Loading...'});
	$scope.blog = BlogDetailService;
	$scope.blog.load($scope.postId).then(function(){
		$ionicLoading.hide();
		console.log($scope.blog.entry);
	});;

	

	$scope.$on('$ionicView.enter', function() {
	    //analytics.trackView('Screen Title');
	    console.log("blog detail enter");
	    $(".tab-nav.tabs").slideUp("fast");
	    $("ion-content").removeClass("has-tabs");
	});
	$scope.$on('$ionicView.leave', function() {
	    //analytics.trackView('Screen Title');
	    console.log("blog detail leave");
	    //$(".tab-nav.tabs").hide("fast");
	});
});
