var app = angular.module('frank.controllers.blog.detail', []);

app.controller('BlogDetailController', function($scope,$stateParams) {
	console.log("BlogDetailController");
	$scope.postId = $stateParams.id;
	console.log("ID:"+$scope.postId);

	

	$scope.$on('$ionicView.enter', function() {
	    //analytics.trackView('Screen Title');
	    console.log("blog detail enter");
	    //$(".tab-nav.tabs").hide("fast");
	});
	$scope.$on('$ionicView.leave', function() {
	    //analytics.trackView('Screen Title');
	    console.log("blog detail leave");
	    //$(".tab-nav.tabs").hide("fast");
	});
});
